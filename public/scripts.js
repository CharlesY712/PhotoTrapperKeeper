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
      alert("You successfully added a photo!");
    } else {
      alert("You did something wrong")
    }
  } catch (err) {
    console.log({err})
  }
});

const getPhotos = async () => {
  $('#photos-container').innerHTML = ''

  const response = await fetch('/api/v1/photos')
  const photos = await response.json()

  photos.forEach(photo => {
    $('#photos-container').append(`
    <article class="photo-wrapper" id="${photo.id}">
      <img src="${photo.url}" alt="${photo.title} id="photo" height="200" width="200">
      <h3>${photo.title}</h3>
      <button>Delete</button>
    </article>
  `)
  });
}

window.onload = () => {
  getPhotos()
}