// ---- Supabase Setup ----
const SUPABASE_URL = 'https://gqrdinzjvjuczxchfzhx.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxcmRpbnpqdmp1Y3p4Y2hmemh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNzYxOTgsImV4cCI6MjA5Njc1MjE5OH0.ynq2KIgIzWJeiAs8MfCim2-Tl5_5PalkumTlK6ZNNOY'
const { createClient } = supabase
const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ---- Dummy Data ----
const STORIES_DATA = [
  { id: 2, username: 'john_doe', avatar: 'https://i.pravatar.cc/56?img=3' },
  { id: 3, username: 'jane_smith', avatar: 'https://i.pravatar.cc/56?img=5' },
  { id: 4, username: 'mike_jones', avatar: 'https://i.pravatar.cc/56?img=7' },
  { id: 5, username: 'sarah_connor', avatar: 'https://i.pravatar.cc/56?img=9' },
  { id: 6, username: 'alex_turner', avatar: 'https://i.pravatar.cc/56?img=11' },
  { id: 7, username: 'emma_watson', avatar: 'https://i.pravatar.cc/56?img=13' },
  { id: 8, username: 'david_lee', avatar: 'https://i.pravatar.cc/56?img=15' },
  { id: 9, username: 'lisa_chen', avatar: 'https://i.pravatar.cc/56?img=17' },
]

const POSTS_DATA = [
  { id: 'post-1', username: 'john_doe', avatar: 'https://i.pravatar.cc/32?img=3', image: 'https://picsum.photos/600/600?random=1', likes: 1234, caption: 'Living my best life! #travel #adventure', comments: 48, time: '2 hours ago', isLiked: false, isSaved: false },
  { id: 'post-2', username: 'jane_smith', avatar: 'https://i.pravatar.cc/32?img=5', image: 'https://picsum.photos/600/600?random=2', likes: 892, caption: 'Coffee and vibes ☕️', comments: 23, time: '4 hours ago', isLiked: false, isSaved: false },
  { id: 'post-3', username: 'mike_jones', avatar: 'https://i.pravatar.cc/32?img=7', image: 'https://picsum.photos/600/600?random=3', likes: 2567, caption: 'Weekend adventures with the crew 🚀', comments: 156, time: '6 hours ago', isLiked: false, isSaved: false },
  { id: 'post-4', username: 'sarah_connor', avatar: 'https://i.pravatar.cc/32?img=9', image: 'https://picsum.photos/600/600?random=4', likes: 543, caption: 'New recipe alert! 🍳 #foodie', comments: 31, time: '8 hours ago', isLiked: false, isSaved: false },
  { id: 'post-5', username: 'alex_turner', avatar: 'https://i.pravatar.cc/32?img=11', image: 'https://picsum.photos/600/600?random=5', likes: 1876, caption: 'Sunset vibes 🌅', comments: 89, time: '12 hours ago', isLiked: false, isSaved: false },
]

const SUGGESTIONS_DATA = [
  { id: 1, username: 'travel_adventures', avatar: 'https://i.pravatar.cc/32?img=21', reason: 'Followed by john_doe' },
  { id: 2, username: 'food_lovers', avatar: 'https://i.pravatar.cc/32?img=22', reason: 'Suggested for you' },
  { id: 3, username: 'photography_art', avatar: 'https://i.pravatar.cc/32?img=23', reason: 'Followed by jane_smith' },
  { id: 4, username: 'fitness_motivation', avatar: 'https://i.pravatar.cc/32?img=24', reason: 'Suggested for you' },
  { id: 5, username: 'tech_updates', avatar: 'https://i.pravatar.cc/32?img=25', reason: 'New to Instagram' },
]

// ---- Track current user ----
let currentUser = null

// ---- Initialize App ----
document.addEventListener('DOMContentLoaded', async () => {
  // Get logged in user
  const { data: { user } } = await client.auth.getUser()
  currentUser = user

  // If not logged in redirect to login
  if (!currentUser) {
    window.location.href = 'index.html'
    return
  }

  renderStories()
  renderPosts()
  renderSuggestions()
  setupStoriesScroll()
  setupPostInteractions()

  // Load saved state for all posts
  await loadSavedStates()
})

// ---- Load which posts are already saved by user ----
async function loadSavedStates() {
  if (!currentUser) return

  const { data: saved } = await client
    .from('saved_posts')
    .select('post_id')
    .eq('user_id', currentUser.id)

  if (!saved) return

  // For each saved post_id mark the button as saved
  saved.forEach(row => {
    const postCard = document.querySelector(`[data-post-id="${row.post_id}"]`)
    if (postCard) {
      const saveBtn = postCard.querySelector('.save-btn')
      const svg = saveBtn?.querySelector('svg')
      if (saveBtn && svg) {
        saveBtn.classList.add('saved')
        svg.setAttribute('fill', 'currentColor')
      }
    }
  })
}

// ---- Render Stories ----
function renderStories() {
  const wrapper = document.getElementById('stories-wrapper')
  STORIES_DATA.forEach(story => {
    const storyEl = document.createElement('div')
    storyEl.className = 'story-item'
    storyEl.innerHTML = `
      <div class="story-avatar">
        <img src="${story.avatar}" alt="${story.username}">
      </div>
      <span class="story-username">${story.username}</span>
    `
    wrapper.appendChild(storyEl)
  })
}

// ---- Render Posts ----
function renderPosts() {
  const feed = document.getElementById('posts-feed')
  POSTS_DATA.forEach(post => {
    const postEl = document.createElement('article')
    postEl.className = 'post-card'
    postEl.dataset.postId = post.id
    postEl.innerHTML = `
      <header class="post-header">
        <a href="profile.html" class="post-avatar">
          <img src="${post.avatar}" alt="${post.username}">
        </a>
        <div class="post-user-info">
          <a href="profile.html" class="post-username">${post.username}</a>
        </div>
        <button class="follow-btn" data-following="false">Follow</button>
        <button class="post-more-btn">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="1"/>
            <circle cx="19" cy="12" r="1"/>
            <circle cx="5" cy="12" r="1"/>
          </svg>
        </button>
      </header>
      <div class="post-image-container">
        <img src="${post.image}" alt="Post" class="post-image" loading="lazy">
      </div>
      <div class="post-actions">
        <div class="post-actions-left">
          <button class="action-btn like-btn ${post.isLiked ? 'liked' : ''}" aria-label="Like">
            <svg viewBox="0 0 24 24" fill="${post.isLiked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
          <button class="action-btn comment-btn" aria-label="Comment">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
            </svg>
          </button>
          <button class="action-btn share-btn" aria-label="Share">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
        <button class="action-btn save-btn ${post.isSaved ? 'saved' : ''}" aria-label="Save">
          <svg viewBox="0 0 24 24" fill="${post.isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
        </button>
      </div>
      <div class="post-likes"><span class="likes-count">${formatNumber(post.likes)}</span> likes</div>
      <div class="post-caption"><span class="username">${post.username}</span> ${post.caption}</div>
      <a href="#" class="post-comments-link">View all ${post.comments} comments</a>
      <div class="post-time">${post.time}</div>
      <div class="post-add-comment">
        <input type="text" placeholder="Add a comment...">
        <button disabled>Post</button>
      </div>
    `
    feed.appendChild(postEl)
  })
}

// ---- Render Suggestions ----
function renderSuggestions() {
  const list = document.getElementById('suggestions-list')
  SUGGESTIONS_DATA.forEach(suggestion => {
    const item = document.createElement('div')
    item.className = 'suggestion-item'
    item.innerHTML = `
      <a href="profile.html" class="suggestion-avatar">
        <img src="${suggestion.avatar}" alt="${suggestion.username}">
      </a>
      <div class="suggestion-info">
        <a href="profile.html" class="username">${suggestion.username}</a>
        <span class="reason">${suggestion.reason}</span>
      </div>
      <button class="suggestion-follow-btn" data-following="false">Follow</button>
    `
    list.appendChild(item)
  })
}

// ---- Stories Scroll ----
function setupStoriesScroll() {
  const wrapper = document.getElementById('stories-wrapper')
  const scrollLeft = document.getElementById('scroll-left')
  const scrollRight = document.getElementById('scroll-right')
  let isDown = false, startX, scrollLeftStart

  wrapper.addEventListener('mousedown', (e) => {
    isDown = true
    startX = e.pageX - wrapper.offsetLeft
    scrollLeftStart = wrapper.scrollLeft
    wrapper.style.cursor = 'grabbing'
  })
  wrapper.addEventListener('mouseleave', () => { isDown = false; wrapper.style.cursor = 'grab' })
  wrapper.addEventListener('mouseup', () => { isDown = false; wrapper.style.cursor = 'grab' })
  wrapper.addEventListener('mousemove', (e) => {
    if (!isDown) return
    e.preventDefault()
    const x = e.pageX - wrapper.offsetLeft
    wrapper.scrollLeft = scrollLeftStart - (x - startX) * 2
  })
  scrollLeft?.addEventListener('click', () => wrapper.scrollBy({ left: -300, behavior: 'smooth' }))
  scrollRight?.addEventListener('click', () => wrapper.scrollBy({ left: 300, behavior: 'smooth' }))
}

// ---- Post Interactions ----
function setupPostInteractions() {
  document.querySelectorAll('.like-btn').forEach(btn => btn.addEventListener('click', handleLike))
  document.querySelectorAll('.save-btn').forEach(btn => btn.addEventListener('click', handleSave))
  document.querySelectorAll('.follow-btn').forEach(btn => btn.addEventListener('click', handleFollow))
  document.querySelectorAll('.suggestion-follow-btn').forEach(btn => btn.addEventListener('click', handleFollow))
  document.querySelectorAll('.post-add-comment input').forEach(input => input.addEventListener('input', handleCommentInput))
  document.querySelectorAll('.post-image').forEach(img => img.addEventListener('dblclick', handleDoubleTapLike))
}

// ---- Handle Like ----
function handleLike(e) {
  const btn = e.currentTarget
  const post = btn.closest('.post-card')
  const likesCount = post.querySelector('.likes-count')
  const svg = btn.querySelector('svg')
  const currentLikes = parseInt(likesCount.textContent.replace(/,/g, ''))

  if (btn.classList.contains('liked')) {
    btn.classList.remove('liked')
    svg.setAttribute('fill', 'none')
    likesCount.textContent = formatNumber(currentLikes - 1)
  } else {
    btn.classList.add('liked')
    svg.setAttribute('fill', 'currentColor')
    likesCount.textContent = formatNumber(currentLikes + 1)
  }
}

// ---- Handle Save (connected to Supabase) ----
async function handleSave(e) {
  const btn = e.currentTarget
  const svg = btn.querySelector('svg')
  const postCard = btn.closest('.post-card')
  const postId = postCard.dataset.postId

  // Must be logged in
  if (!currentUser) {
    alert('Please login to save posts')
    return
  }

  if (btn.classList.contains('saved')) {
    // ---- UNSAVE ----
    btn.classList.remove('saved')
    svg.setAttribute('fill', 'none')

    const { error } = await client
      .from('saved_posts')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', currentUser.id)

    if (error) {
      // Revert UI if error
      console.error('Unsave error:', error)
      btn.classList.add('saved')
      svg.setAttribute('fill', 'currentColor')
    }

  } else {
    // ---- SAVE ----
    btn.classList.add('saved')
    svg.setAttribute('fill', 'currentColor')

    const { error } = await client
      .from('saved_posts')
      .insert({ post_id: postId, user_id: currentUser.id })

    if (error) {
      // Revert UI if error
      console.error('Save error:', error)
      btn.classList.remove('saved')
      svg.setAttribute('fill', 'none')
    }
  }
}

// ---- Handle Follow ----
function handleFollow(e) {
  const btn = e.currentTarget
  const isFollowing = btn.dataset.following === 'true'
  if (isFollowing) {
    btn.textContent = 'Follow'
    btn.dataset.following = 'false'
    btn.classList.remove('following')
  } else {
    btn.textContent = 'Following'
    btn.dataset.following = 'true'
    btn.classList.add('following')
  }
}

// ---- Handle Comment Input ----
function handleCommentInput(e) {
  const input = e.target
  const postBtn = input.nextElementSibling
  if (input.value.trim()) {
    postBtn.disabled = false
    postBtn.classList.add('active')
  } else {
    postBtn.disabled = true
    postBtn.classList.remove('active')
  }
}

// ---- Double Tap Like ----
function handleDoubleTapLike(e) {
  const post = e.target.closest('.post-card')
  const likeBtn = post.querySelector('.like-btn')
  if (!likeBtn.classList.contains('liked')) {
    const svg = likeBtn.querySelector('svg')
    const likesCount = post.querySelector('.likes-count')
    const currentLikes = parseInt(likesCount.textContent.replace(/,/g, ''))
    likeBtn.classList.add('liked')
    svg.setAttribute('fill', 'currentColor')
    likesCount.textContent = formatNumber(currentLikes + 1)
    showDoubleTapHeart(e.target)
  }
}

// ---- Double Tap Heart Animation ----
function showDoubleTapHeart(imageElement) {
  const container = imageElement.closest('.post-image-container') || imageElement.parentElement
  const heart = document.createElement('span')
  heart.innerHTML = `<svg width="80" height="80" viewBox="0 0 24 24" fill="white"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`
  heart.style.cssText = `position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) scale(0);animation:doubleTapHeart 0.8s ease-out forwards;pointer-events:none;z-index:10;`
  container.style.position = 'relative'
  container.appendChild(heart)
  setTimeout(() => heart.remove(), 1000)
}

// ---- Animations ----
const style = document.createElement('style')
style.textContent = `
  @keyframes doubleTapHeart {
    0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
    15% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
    30% { transform: translate(-50%, -50%) scale(0.95); opacity: 1; }
    45% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
  }
  .post-image-container { position: relative; }
`
document.head.appendChild(style)

// ---- Format Numbers ----
function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  return num.toLocaleString()
}