// Profile Module - Profile Page Logic

// Dummy data for profile posts
const PROFILE_POSTS = [
  { id: 1, image: 'https://picsum.photos/400/400?random=10', likes: 234, comments: 12 },
  { id: 2, image: 'https://picsum.photos/400/400?random=11', likes: 567, comments: 45 },
  { id: 3, image: 'https://picsum.photos/400/400?random=12', likes: 891, comments: 67 },
  { id: 4, image: 'https://picsum.photos/400/400?random=13', likes: 123, comments: 8 },
  { id: 5, image: 'https://picsum.photos/400/400?random=14', likes: 456, comments: 34 },
  { id: 6, image: 'https://picsum.photos/400/400?random=15', likes: 789, comments: 56 },
  { id: 7, image: 'https://picsum.photos/400/400?random=16', likes: 321, comments: 23 },
  { id: 8, image: 'https://picsum.photos/400/400?random=17', likes: 654, comments: 41 },
  { id: 9, image: 'https://picsum.photos/400/400?random=18', likes: 987, comments: 78 },
  { id: 10, image: 'https://picsum.photos/400/400?random=19', likes: 111, comments: 9 },
  { id: 11, image: 'https://picsum.photos/400/400?random=20', likes: 222, comments: 15 },
  { id: 12, image: 'https://picsum.photos/400/400?random=21', likes: 333, comments: 21 },
];

// Dummy data for saved posts
const SAVED_POSTS = [
  { id: 1, image: 'https://picsum.photos/400/400?random=30', likes: 1200, comments: 89 },
  { id: 2, image: 'https://picsum.photos/400/400?random=31', likes: 800, comments: 45 },
  { id: 3, image: 'https://picsum.photos/400/400?random=32', likes: 1500, comments: 120 },
  { id: 4, image: 'https://picsum.photos/400/400?random=33', likes: 600, comments: 30 },
];

// Initialize profile page
document.addEventListener('DOMContentLoaded', () => {
  loadProfile();
  renderPosts();
  renderSavedPosts();
  setupTabSwitching();
  setupEditProfile();
});

// Load profile data
async function loadProfile() {
  // TODO: Load profile from Supabase
  // const { data: profile, error } = await supabase
  //   .from('profiles')
  //   .select('*')
  //   .eq('id', currentUserId)
  //   .single();
  //
  // if (error) {
  //   console.error('Error loading profile:', error);
  //   return;
  // }
  //
  // document.getElementById('profile-username').textContent = profile.username;
  // document.getElementById('profile-name').textContent = profile.full_name;
  // document.getElementById('profile-bio').textContent = profile.bio;
  // document.getElementById('profile-website').textContent = profile.website;
  // document.getElementById('profile-avatar').src = profile.avatar_url;

  // Demo mode: Show dummy stats
  updateStats();
}

// Update profile stats
function updateStats() {
  // TODO: Fetch stats from Supabase
  // const postsCount = await supabase.from('posts').select('*', { count: 'exact', head: true }).eq('user_id', currentUserId);
  // const followersCount = await supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', currentUserId);
  // const followingCount = await supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower_id', currentUserId);

  document.getElementById('posts-count').textContent = PROFILE_POSTS.length;
  document.getElementById('followers-count').textContent = '2,584';
  document.getElementById('following-count').textContent = '485';
}

// Render posts grid
function renderPosts() {
  const grid = document.getElementById('profile-grid');

  PROFILE_POSTS.forEach(post => {
    const item = createGridItem(post);
    grid.appendChild(item);
  });
}

// Render saved posts grid
function renderSavedPosts() {
  const grid = document.getElementById('saved-grid');

  SAVED_POSTS.forEach(post => {
    const item = createGridItem(post);
    grid.appendChild(item);
  });
}

// Create a grid item element
function createGridItem(post) {
  const item = document.createElement('div');
  item.className = 'profile-grid-item';
  item.innerHTML = `
    <img src="${post.image}" alt="Post" loading="lazy">
    <div class="profile-grid-overlay">
      <span class="overlay-stat">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        ${formatNumber(post.likes)}
      </span>
      <span class="overlay-stat">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
        </svg>
        ${post.comments}
      </span>
    </div>
  `;

  // Click to open post modal (optional)
  item.addEventListener('click', () => openPostModal(post.id));

  return item;
}

// Setup tab switching
function setupTabSwitching() {
  const tabs = document.querySelectorAll('.profile-tab');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.dataset.tab;

      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Update visible grid
      document.querySelectorAll('.profile-grid').forEach(grid => {
        grid.style.display = 'none';
      });

      const targetGrid = document.getElementById(`${tabName}-grid`);
      if (targetGrid) {
        targetGrid.style.display = 'grid';
      }

      // TODO: Load data for selected tab from Supabase
      // if (tabName === 'saved') {
      //   loadSavedPosts();
      // } else if (tabName === 'tagged') {
      //   loadTaggedPosts();
      // }
    });
  });
}

// Setup edit profile button
function setupEditProfile() {
  const editBtn = document.getElementById('edit-profile-btn');

  editBtn.addEventListener('click', () => {
    openEditModal();
  });
}

// Open edit profile modal
function openEditModal() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.id = 'edit-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <h2>Edit profile</h2>
      <form id="edit-form" style="text-align: left;">
        <div class="form-group" style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 4px; font-size: 12px; color: #8e8e8e;">Name</label>
          <input type="text" id="edit-name" value="Full Name" style="width: 100%; padding: 8px; border: 1px solid #dbdbdb; border-radius: 4px;">
        </div>
        <div class="form-group" style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 4px; font-size: 12px; color: #8e8e8e;">Username</label>
          <input type="text" id="edit-username-input" value="username_" style="width: 100%; padding: 8px; border: 1px solid #dbdbdb; border-radius: 4px;">
        </div>
        <div class="form-group" style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 4px; font-size: 12px; color: #8e8e8e;">Bio</label>
          <textarea id="edit-bio" rows="3" style="width: 100%; padding: 8px; border: 1px solid #dbdbdb; border-radius: 4px; resize: vertical;">Bio text goes here</textarea>
        </div>
        <div class="form-group" style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 4px; font-size: 12px; color: #8e8e8e;">Website</label>
          <input type="url" id="edit-website" value="website.com" style="width: 100%; padding: 8px; border: 1px solid #dbdbdb; border-radius: 4px;">
        </div>
      </form>
      <div class="modal-actions">
        <button class="modal-btn primary" id="save-profile-btn">Save</button>
        <button class="modal-btn secondary" id="cancel-edit-btn">Cancel</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Close on overlay click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeEditModal();
  });

  // Save button
  document.getElementById('save-profile-btn').addEventListener('click', saveProfile);

  // Cancel button
  document.getElementById('cancel-edit-btn').addEventListener('click', closeEditModal);
}

// Close edit modal
function closeEditModal() {
  const modal = document.getElementById('edit-modal');
  if (modal) modal.remove();
}

// Save profile changes
async function saveProfile() {
  const name = document.getElementById('edit-name').value;
  const username = document.getElementById('edit-username-input').value;
  const bio = document.getElementById('edit-bio').value;
  const website = document.getElementById('edit-website').value;

  // TODO: Save to Supabase
  // const { error } = await supabase
  //   .from('profiles')
  //   .update({ username, full_name: name, bio, website })
  //   .eq('id', currentUserId);
  //
  // if (error) {
  //   alert('Error saving profile: ' + error.message);
  //   return;
  // }

  // Update UI
  document.getElementById('profile-username').textContent = username;
  document.getElementById('profile-name').textContent = name;
  document.getElementById('profile-bio').textContent = bio;
  document.getElementById('profile-website').textContent = website;

  closeEditModal();
}

// Open post modal (optional - for viewing full post)
function openPostModal(postId) {
  // TODO: Implement post modal
  console.log('Open post:', postId);
}

// Format large numbers
function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toLocaleString();
}
