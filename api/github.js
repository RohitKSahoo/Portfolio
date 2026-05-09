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

    // 2. Extract contributions for the "Learning Velocity" graph
    // The UI graph has 17 bars. Let's use the last 17 weeks of contributions.
    const allWeeks = user.contributionsCollection.contributionCalendar.weeks;
    const recentWeeks = allWeeks.slice(-17);
    const velocity = recentWeeks.map(week => {
      // Sum the contributions for that week
      return week.contributionDays.reduce((acc, day) => acc + day.contributionCount, 0);
    });

    // Normalize velocity array to percentages (0-100) for the CSS height
    const maxVelocity = Math.max(...velocity, 1); // Avoid division by 0
    const normalizedVelocity = velocity.map(v => Math.round((v / maxVelocity) * 100));

    // Send formatted data to frontend
    res.status(200).json({
      projects: user.repositories.totalCount,
      technologies: languages.size,
      since: new Date(user.createdAt).getFullYear(),
      velocity: normalizedVelocity,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch from GitHub" });
  }
}
