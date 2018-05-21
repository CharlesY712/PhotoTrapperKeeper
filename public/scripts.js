$("#photos-form").submit(async (event) => {
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
      alert("You successfully added a photo!")
    } else {
      alert("You did something wrong")
    }
  } catch (err) {
    console.log({err})
  }
});
