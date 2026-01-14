const form = document.querySelector('.url-form');


form.addEventListener('submit', (event)=>{
    // event.preventDefault();

    const formData = new FormData(event.target);
    const url = formData.get('url');
    const shortCode = formData.get('shortCode')

    console.log(url,shortCode);
    })