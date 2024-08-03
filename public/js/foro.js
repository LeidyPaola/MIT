document.addEventListener('DOMContentLoaded', function() {
  const postForm = document.getElementById('postForm');
  const postsContainer = document.getElementById('postsContainer');

  postForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const author = document.getElementById('author').value;

    fetch('/foro/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, content, author })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        loadPosts();
        postForm.reset();
      } else {
        alert('Error al crear el post');
      }
    })
    .catch(error => console.error('Error:', error));
  });

  function loadPosts() {
    fetch('/foro')
      .then(response => response.json())
      .then(data => {
        postsContainer.innerHTML = '';
        data.posts.forEach(post => {
          const postElement = document.createElement('article');
          postElement.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.content}</p>
            <p><em>Autor: ${post.author}</em></p>
          `;
          postsContainer.appendChild(postElement);
        });
      })
      .catch(error => console.error('Error:', error));
  }

  loadPosts();
});
