import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/palee-architecture/',
  title: 'PALEE Architecture',
  description: 'Personal Active Learning & Evaluation Engine — Deep System Architecture & Specifications',
  lastUpdated: true,
  cleanUrls: true,
  appearance: 'force-dark',

  markdown: {
    math: true,
    config(md) {
      const fence = md.renderer.rules.fence
      if (!fence) return
      md.renderer.rules.fence = (tokens, idx, options, env, self) => {
        const token = tokens[idx]
        if (token.info.trim() === 'mermaid') {
          const graph = encodeURIComponent(token.content)
          return `<div class="mermaid-block" data-graph="${graph}"><div class="mermaid"></div></div>\n`
        }
        return fence(tokens, idx, options, env, self)
      }
    }
  },

  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/palee-architecture/favicon.png' }]
  ],

  themeConfig: {
    logo: '/palee-logo.png',
    siteTitle: 'PALEE Architecture',

    nav: [
      { text: 'Overview', link: '/Architecture Overview/Architecture Overview' },
      { text: 'Core Engine', link: '/Core Engine/Core Engine' },
      { text: 'Storage System', link: '/Storage System/Storage System' },
      { text: 'Validation', link: '/Validation Framework/Validation Framework' },
      { text: 'Command Ref', link: '/Command Reference/Command Reference' },
      { text: 'User Docs (cli)', link: 'https://kuldeep2822k.github.io/cli/' },
      { text: 'CLI Repository', link: 'https://github.com/Kuldeep2822k/cli' }
    ],

    sidebar: [
    {
        "text": "Architecture Overview",
        "collapsed": false,
        "link": "/Architecture Overview/Architecture Overview",
        "items": [
            {
                "text": "Core Algorithms and Engine",
                "link": "/Architecture Overview/Core Algorithms and Engine"
            },
            {
                "text": "Data Flow and State Management",
                "link": "/Architecture Overview/Data Flow and State Management"
            },
            {
                "text": "Layered Architecture Design",
                "link": "/Architecture Overview/Layered Architecture Design"
            },
            {
                "text": "Security and Concurrency Model",
                "link": "/Architecture Overview/Security and Concurrency Model"
            },
            {
                "text": "Storage and Vault System",
                "link": "/Architecture Overview/Storage and Vault System"
            },
            {
                "text": "Validation Framework and Integrity",
                "link": "/Architecture Overview/Validation Framework and Integrity"
            }
        ]
    },
    {
        "text": "Core Engine",
        "collapsed": false,
        "link": "/Core Engine/Core Engine",
        "items": [
            {
                "text": "Auto-Chaining and Prerequisite Discovery",
                "link": "/Core Engine/Auto-Chaining and Prerequisite Discovery"
            },
            {
                "text": "Dependency Graph Engine",
                "link": "/Core Engine/Dependency Graph Engine"
            },
            {
                "text": "Mastery Calculation System",
                "link": "/Core Engine/Mastery Calculation System"
            },
            {
                "text": "SM-2 Spaced Repetition Algorithm",
                "link": "/Core Engine/SM-2 Spaced Repetition Algorithm"
            },
            {
                "text": "Table of Contents Chain Processing",
                "link": "/Core Engine/Table of Contents Chain Processing"
            },
            {
                "text": "Tier 0 Hygiene Rules",
                "link": "/Core Engine/Tier 0 Hygiene Rules"
            },
            {
                "text": "Topic ID Management",
                "link": "/Core Engine/Topic ID Management"
            }
        ]
    },
    {
        "text": "Storage System",
        "collapsed": false,
        "link": "/Storage System/Storage System",
        "items": [
            {
                "text": "Atomic Write System",
                "link": "/Storage System/Atomic Write System"
            },
            {
                "text": "Dependency and TOC Management",
                "link": "/Storage System/Dependency and TOC Management"
            },
            {
                "text": "File Locking and Concurrency Control",
                "link": "/Storage System/File Locking and Concurrency Control"
            },
            {
                "text": "Frontmatter Parser and Updater",
                "link": "/Storage System/Frontmatter Parser and Updater"
            },
            {
                "text": "Session Memory and Storage",
                "link": "/Storage System/Session Memory and Storage"
            },
            {
                "text": "Source Cap and Pattern Matching",
                "link": "/Storage System/Source Cap and Pattern Matching"
            },
            {
                "text": "Vault Walker and Scanner",
                "link": "/Storage System/Vault Walker and Scanner"
            }
        ]
    },
    {
        "text": "Application Layer",
        "collapsed": false,
        "link": "/Application Layer/Application Layer",
        "items": [
            {
                "text": "Assessment Recording Workflow",
                "link": "/Application Layer/Assessment Recording Workflow"
            },
            {
                "text": "Due Topics Discovery",
                "link": "/Application Layer/Due Topics Discovery"
            },
            {
                "text": "Mastery Summary Computation",
                "link": "/Application Layer/Mastery Summary Computation"
            },
            {
                "text": "Next Topics Recommendation",
                "link": "/Application Layer/Next Topics Recommendation"
            },
            {
                "text": "Review Recording Workflow",
                "link": "/Application Layer/Review Recording Workflow"
            }
        ]
    },
    {
        "text": "Validation Framework",
        "collapsed": false,
        "link": "/Validation Framework/Validation Framework",
        "items": [
            {
                "text": "Output Formatting System",
                "link": "/Validation Framework/Output Formatting System"
            },
            {
                "text": "Rule Execution Engine",
                "link": "/Validation Framework/Rule Execution Engine"
            },
            {
                "text": "Validation Rule Catalog",
                "link": "/Validation Framework/Validation Rule Catalog"
            },
            {
                "text": "Vault Collection System",
                "link": "/Validation Framework/Vault Collection System"
            }
        ]
    },
    {
        "text": "Command Reference",
        "collapsed": false,
        "link": "/Command Reference/Command Reference",
        "items": [
            {
                "text": "Content Management Commands",
                "link": "/Command Reference/Content Management Commands"
            },
            {
                "text": "General CLI Concepts and Conventions",
                "link": "/Command Reference/General CLI Concepts and Conventions"
            },
            {
                "text": "Learning Workflow Commands",
                "link": "/Command Reference/Learning Workflow Commands"
            },
            {
                "text": "Maintenance and System Commands",
                "link": "/Command Reference/Maintenance and System Commands"
            },
            {
                "text": "Planning and Analysis Commands",
                "link": "/Command Reference/Planning and Analysis Commands"
            }
        ]
    },
    {
        "text": "Data Models and Types",
        "collapsed": false,
        "link": "/Data Models and Types/Data Models and Types",
        "items": [
            {
                "text": "Assessment Model",
                "link": "/Data Models and Types/Assessment Model"
            },
            {
                "text": "Configuration and CLI Option Types",
                "link": "/Data Models and Types/Configuration and CLI Option Types"
            },
            {
                "text": "Review Model (SM-2 Scheduling)",
                "link": "/Data Models and Types/Review Model (SM-2 Scheduling)"
            },
            {
                "text": "Session Types and Lifecycle",
                "link": "/Data Models and Types/Session Types and Lifecycle"
            },
            {
                "text": "Supporting Data Models",
                "link": "/Data Models and Types/Supporting Data Models"
            },
            {
                "text": "Topic Entity",
                "link": "/Data Models and Types/Topic Entity"
            }
        ]
    },
    {
        "text": "Architecture Decision Records",
        "collapsed": false,
        "link": "/Architecture Decision Records/Architecture Decision Records",
        "items": [
            {
                "text": "ADR Lifecycle and Conventions",
                "link": "/Architecture Decision Records/ADR Lifecycle and Conventions"
            },
            {
                "text": "AI Integration and Phase 2 Design",
                "link": "/Architecture Decision Records/AI Integration and Phase 2 Design"
            },
            {
                "text": "Application Layer and CLI Decisions",
                "link": "/Architecture Decision Records/Application Layer and CLI Decisions"
            },
            {
                "text": "Core Engineering Decisions",
                "link": "/Architecture Decision Records/Core Engineering Decisions"
            },
            {
                "text": "Data Integrity and Validation Decisions",
                "link": "/Architecture Decision Records/Data Integrity and Validation Decisions"
            },
            {
                "text": "Development and Testing Decisions",
                "link": "/Architecture Decision Records/Development and Testing Decisions"
            },
            {
                "text": "Learning and Pedagogy Decisions",
                "link": "/Architecture Decision Records/Learning and Pedagogy Decisions"
            },
            {
                "text": "Planning and Design Documents",
                "link": "/Architecture Decision Records/Planning and Design Documents"
            }
        ]
    },
    {
        "text": "User Guide",
        "collapsed": false,
        "link": "/User Guide/User Guide",
        "items": [
            {
                "text": "Core Concepts",
                "link": "/User Guide/Core Concepts"
            },
            {
                "text": "Reporting and Analytics",
                "link": "/User Guide/Reporting and Analytics"
            },
            {
                "text": "Review and Scheduling",
                "collapsed": false,
                "link": "/User Guide/Review and Scheduling/Review and Scheduling",
                "items": [
                    {
                        "text": "Interactive Review Workflow",
                        "link": "/User Guide/Review and Scheduling/Interactive Review Workflow"
                    },
                    {
                        "text": "Scheduling Algorithms and Discovery",
                        "link": "/User Guide/Review and Scheduling/Scheduling Algorithms and Discovery"
                    }
                ]
            },
            {
                "text": "Session Management",
                "link": "/User Guide/Session Management"
            },
            {
                "text": "Topic Management",
                "collapsed": false,
                "link": "/User Guide/Topic Management/Topic Management",
                "items": [
                    {
                        "text": "Adopting Topics",
                        "collapsed": false,
                        "link": "/User Guide/Topic Management/Adopting Topics/Adopting Topics",
                        "items": [
                            {
                                "text": "Adopt Commands and Options",
                                "link": "/User Guide/Topic Management/Adopting Topics/Adopt Commands and Options"
                            },
                            {
                                "text": "Undo and Recovery Operations",
                                "link": "/User Guide/Topic Management/Adopting Topics/Undo and Recovery Operations"
                            }
                        ]
                    },
                    {
                        "text": "Assessing Topics",
                        "link": "/User Guide/Topic Management/Assessing Topics"
                    },
                    {
                        "text": "Topic Discovery and Querying",
                        "link": "/User Guide/Topic Management/Topic Discovery and Querying"
                    }
                ]
            }
        ]
    },
    {
        "text": "Guides & Specifications",
        "collapsed": false,
        "items": [
            {
                "text": "Getting Started",
                "link": "/Getting Started"
            },
            {
                "text": "Testing Guide",
                "link": "/Testing Guide"
            },
            {
                "text": "Development Workflow",
                "link": "/Development Workflow"
            },
            {
                "text": "AI Integration (Phase 2)",
                "link": "/AI Integration (Phase 2)"
            }
        ]
    }
],

    search: {
      provider: 'local'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Kuldeep2822k/palee-architecture' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 Kuldeep Kumar. PALEE Deep System Architecture.'
    }
  }
})
