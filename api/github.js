export default async function handler(req, res) {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  
  if (!GITHUB_TOKEN) {
    return res.status(500).json({ error: "Missing GITHUB_TOKEN" });
  }

  // GraphQL query to get repos, languages, and contribution calendar
  const query = `
    query {
      user(login: "RohitKSahoo") {
        createdAt
        repositories(first: 100, isFork: false, ownerAffiliations: OWNER, privacy: PUBLIC) {
          totalCount
          nodes {
            languages(first: 10) {
              nodes {
                name
              }
            }
          }
        }
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${GITHUB_TOKEN}`,
      },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();
    
    if (data.errors) {
      return res.status(500).json({ errors: data.errors });
    }

    const user = data.data.user;

    // 1. Calculate unique technologies (languages used across all repos)
    const languages = new Set();
    user.repositories.nodes.forEach(repo => {
      repo.languages.nodes.forEach(lang => {
        languages.add(lang.name);
      });
    });

    // 2. Extract contributions for the "Contribution Calendar" graph
    // The UI graph will use grid-rows-7 grid-flow-col. Let's use the last 22 weeks of contributions.
    const allWeeks = user.contributionsCollection.contributionCalendar.weeks;
    const recentWeeks = allWeeks.slice(-22);
    
    const calendar = [];
    let maxContribution = 1;

    recentWeeks.forEach(week => {
      week.contributionDays.forEach(day => {
        if (day.contributionCount > maxContribution) {
          maxContribution = day.contributionCount;
        }
        calendar.push(day.contributionCount);
      });
    });

    // Normalize calendar array to intensity (0 to 4)
    // 0 = 0, 1 = >0, 2 = >25%, 3 = >50%, 4 = >75%
    const normalizedCalendar = calendar.map(count => {
      if (count === 0) return 0;
      const ratio = count / maxContribution;
      if (ratio > 0.75) return 4;
      if (ratio > 0.5) return 3;
      if (ratio > 0.25) return 2;
      return 1;
    });

    // Send formatted data to frontend
    res.status(200).json({
      projects: user.repositories.totalCount,
      technologies: languages.size,
      languagesList: Array.from(languages),
      since: new Date(user.createdAt).getFullYear(),
      calendar: normalizedCalendar,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch from GitHub" });
  }
}
