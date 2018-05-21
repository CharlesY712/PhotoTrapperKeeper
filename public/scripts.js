$("#photos-form").submit(async event => {
  event.preventDefault();
  const title = $('#title').val();
  const url = $('#url').val();

  try {
    const response = await fetch('/api/v1/photos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        url
      })
    })
    if (response.status === 201) {
      $('#title').val('');
      $('#url').val('');      
      getPhotos();
    }
  } catch (err) {
    console.log({err})
  }
});

const getPhotos = async () => {
  $('#photos-container').html('')

  const response = await fetch('/api/v1/photos')
  const photos = await response.json()

  photos.forEach(photo => {
    $('#photos-container').append(`
    <article class="photo-wrapper" id="${photo.id}">
      <img src="${photo.url}" alt="${photo.title} id="photo" height="200" width="200">
      <h3>${photo.title}</h3>
      <button onClick="deleteFetch(${photo.id})">Delete</button>
    </article>
  `)
  });
}

const deleteFetch = async (id) => {
  const response = await fetch(`/api/v1/photos/${id}`, {
    method: 'DELETE'
  })
  getPhotos()
}

window.onload = () => {
  getPhotos()
}