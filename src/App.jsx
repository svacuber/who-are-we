
import { useEffect, useMemo, useState } from 'react'
import { supabase } from './supabase'
import './index.css'

const categories = [
  'ALL',
  'HISTORY',
  'SOCIETY',
  'TECHNOLOGY',
  'RANDOM THOUGHTS'
]

function Header({ onHome }) {
  return (
    <header className="navbar">
      <a className="logo" href="#home" onClick={onHome}>
        <span className="tv-icon">▣</span>
        who are we<span className="dot">.</span>
      </a>
      <nav>
        <a href="#home" onClick={onHome}>Home</a>
        <a href="#stories" onClick={onHome}>Stories</a>
        <a href="#about" onClick={onHome}>About</a>
      </nav>
      <span className="search-button" aria-hidden="true">📺</span>
    </header>
  )
}

function StoryCard({ story, onRead }) {
  return (
    <article className="story-card">
      <span className="card-emoji">{story.emoji}</span>
      <span className="category">{story.category}</span>
      <h3>{story.title}</h3>
      <p>{story.preview}</p>
      <button className="read-link" onClick={onRead}>
        Read the story ↗
      </button>
    </article>
  )
}

function ArticlePage({ story, onBack }) {
  return (
    <section className="article-page">
      <button className="read-link back-link" onClick={onBack}>
        ← Back to stories
      </button>

      <div className="article-cover">{story.emoji}</div>
      <span className="category">{story.category}</span>
      <h1 className="article-title">{story.title}</h1>
      <p className="article-intro">{story.preview}</p>

      <div className="article-body">
        {story.content.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      <div className="article-ending">
        <span>✦</span>
        <p>That's one more rabbit hole explored.</p>
        <button className="primary-button" onClick={onBack}>
          Explore more stories ↗
        </button>
      </div>
    </section>
  )
}

function App() {
  const [stories, setStories] = useState([])
  const [selectedStory, setSelectedStory] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchStories() {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('published', true)
        .order('id', { ascending: true })

      if (error) {
        console.error('Supabase error:', error)
        setError('Could not load stories. Please refresh and try again.')
      } else {
        setStories(data || [])
      }

      setLoading(false)
    }

    fetchStories()
  }, [])

  const filteredStories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return stories.filter((story) => {
      const matchesCategory =
        activeCategory === 'ALL' ||
        story.category === activeCategory

      const searchableText =
        `${story.title} ${story.preview} ${story.category} ${(story.content || []).join(' ')}`.toLowerCase()

      const matchesSearch = searchableText.includes(query)

      return matchesCategory && matchesSearch
    })
  }, [stories, searchQuery, activeCategory])

  function goHome() {
    setSelectedStory(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="website">
      <Header onHome={goHome} />

      {selectedStory ? (
        <main>
          <ArticlePage story={selectedStory} onBack={goHome} />
        </main>
      ) : (
        <main>
          <section className="hero" id="home">
            <div className="hero-text">
              <span className="eyebrow">A LITTLE CORNER OF THE INTERNET</span>
              <h1>
                The world is weird.
                <br />
                <span>Let's talk about it.</span>
              </h1>
              <p>
                History's plot twists, society's strange habits,
                and thoughts that refuse to leave my head.
                No breaking news. Just things worth thinking about.
              </p>
              <a className="primary-button" href="#stories">
                Enter the rabbit hole <span>↗</span>
              </a>
            </div>

            <div className="tv-scene" aria-label="Cartoon television mascot">
              <div className="stars">✦ &nbsp; · &nbsp; ✧</div>
              <div className="antenna"></div>
              <div className="tv">
                <div className="tv-screen">
                  <span className="screen-eyes">◉ ◉</span>
                  <span className="screen-mouth">﹏</span>
                  <span className="screen-caption">THINK AGAIN.</span>
                </div>
                <div className="tv-controls">
                  <span>●</span>
                  <span>◉</span>
                  <span>●</span>
                </div>
              </div>
              <div className="tv-feet">
                <span></span>
                <span></span>
              </div>
              <div className="floating-note note-one">hmm...</div>
              <div className="floating-note note-two">📺</div>
            </div>
          </section>

          <section className="stories" id="stories">
            <div className="section-heading">
              <div>
                <span className="eyebrow">THE LATEST RABBIT HOLES</span>
                <h2>
                  Things worth a second thought<span className="dot">.</span>
                </h2>
              </div>
              <span className="handwritten">pick your curiosity ↙</span>
            </div>

            <div className="story-tools">
              <label className="search-field">
                <span aria-hidden="true">⌕</span>
                <input
                  type="search"
                  placeholder="Search rabbit holes..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  aria-label="Search articles"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="clear-search"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}
              </label>

              <div className="category-filters" aria-label="Filter by category">
                {categories.map((category) => (
                  <button
                    type="button"
                    key={category}
                    className={`category-chip ${
                      activeCategory === category ? 'active' : ''
                    }`}
                    onClick={() => setActiveCategory(category)}
                    aria-pressed={activeCategory === category}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="story-grid">
              {loading ? (
                <p>Loading stories... 📺</p>
              ) : error ? (
                <div className="empty-results">
                  <span>📺</span>
                  <h3>Oops! Something went wrong.</h3>
                  <p>{error}</p>
                  <button
                    type="button"
                    className="primary-button"
                    onClick={() => window.location.reload()}
                  >
                    Try again ↗
                  </button>
                </div>
              ) : filteredStories.length > 0 ? (
                filteredStories.map((story) => (
                  <StoryCard
                    key={story.id}
                    story={story}
                    onRead={() => {
                      setSelectedStory(story)
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                  />
                ))
              ) : (
                <div className="empty-results">
                  <span>📺</span>
                  <h3>No rabbit holes found!</h3>
                  <p>
                    Nothing matched your search. Try another keyword or category.
                  </p>
                  <button
                    type="button"
                    className="primary-button"
                    onClick={() => {
                      setSearchQuery('')
                      setActiveCategory('ALL')
                    }}
                  >
                    Show all stories ↗
                  </button>
                </div>
              )}
            </div>
          </section>

          <section className="about" id="about">
            <span className="eyebrow">SO, WHO ARE WE?</span>
            <p>
              Just curious people trying to make sense of a world
              that clearly did not come with an instruction manual.
            </p>
          </section>
        </main>
      )}

      <footer>
        <span>who are we<span className="dot">.</span></span>
        <span>Made for the curious. And the mildly confused.</span>
      </footer>
    </div>
  )
}

export default App
