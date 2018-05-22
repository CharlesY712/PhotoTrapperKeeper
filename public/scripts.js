$("#photos-form").submit(async event => {
  event.preventDefault();
  const title = $('#title').val();
  const url = $('#url').val();

  if (title && url) {
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
  }
});

const getPhotos = async () => {
  $('#photos-container').html('')

  const response = await fetch('/api/v1/photos')
  const photos = await response.json()

  photos.forEach(photo => {
    $('#photos-container').append(`
    <article class="photo-wrapper" id="${photo.id}">
      <img src="${photo.url}" alt="${photo.title}" class="photo">
      <h3>${photo.title}</h3>
      <button class="delete-button" onClick="deleteFetch(${photo.id})"><img src="./images/TrashCan.svg" alt="trash-can"></button>
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