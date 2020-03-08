(function () {
    const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
    const INDEX_URL = BASE_URL + '/api/v1/users/'
    const userList = document.getElementById('userList')
    const data = JSON.parse(localStorage.getItem('favoriteMovies')) || []

    displayDataList(data)

    userList.addEventListener('click',(event) =>{
        if(event.target.matches('.btn-show-User')){
          showUser(event.target.dataset.id)
        } else if (event.target.matches('.btn-remove-favorite')) {
            removeFavoriteItem(event.target.dataset.id)
        }
    })

    function showUser(id){
        //set element
        const userName = document.getElementById('show-user-name')
        const userImage = document.getElementById('show-user-image')
        const userBirthday = document.getElementById('show-user-birthday')
        const userEmail = document.getElementById('show-user-email')
        //set request url
        const url = INDEX_URL + id
        console.log(url)
        //send request to show api
        axios.get(url)
        .then((response) =>{
            const data = response.data
            //insert data into modal
            userName.textContent = data.name
            userImage.innerHTML = `<img src='${data.avatar}' alt="..." class="rounded-circle">`
            userBirthday.textContent = data.birthday
            userEmail.textContent = `${data.email}`
        })
        .catch((err) => console.log(err))
    }


    function displayDataList(data){
        let htmlContent = ''
        data.forEach(item => {
            htmlContent +=
            `<div class="col-sm-3">
                <div style="width:10rem;">
                    <img src="${item.avatar}" class="card-img-top rounded-circle" alt="..." >
                    <div class="card-body center">
                        <h5 class="card-title"> ${item.name}</h5>
                        <p class="card-text">Age : ${item.age}</p>
                        <a href="#" class="btn btn-outline-info btn-show-User " data-toggle="modal" data-target="#show-user-modal" data-id="${item.id}">More...</a>
                        <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
                    </div>
                </div>
            </div>
            `
        })
        userList.innerHTML = htmlContent
        }

    function removeFavoriteItem (id) {
        const index = data.findIndex(item => item.id === Number(id))
        if (index === -1) return

        data.splice(index,1)
        localStorage.setItem('favoriteMovies',JSON.stringify(data))

        displayDataList(data)
    }
})()