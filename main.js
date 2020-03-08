(function () {
    // API url
    const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
    const INDEX_URL = BASE_URL + '/api/v1/users/'
    const icon = {
        female: '<span><i class="fas fa-venus text-danger"></i></span>',
        male: '<span"><i class="fas fa-mars text-primary"></i></span>',
        birthday: '<i class="fa fa-birthday-cake text-warning" aria-hidden="true"></i>',
        email: '<i class="fa fa-envelope-o text-warning" aria-hidden="true"></i>',
        region: '<i class="fas fa-map-marker-alt text-warning"></i>',
        like: '<i class="fas fa-heart like text-danger"></i>',
        unlike: '<i class="far fa-heart unlike"></i>'
      }
    

    //get element
    const userList = document.getElementById('userList')
    const searchForm = document.getElementById('search')
    const searchInput = document.getElementById('search-input')
    const pagination = document.getElementById('pagination')
    const iconsdisplay = document.getElementById('icons-display')

    // params setting
    const ITEM_PER_PAGE = 12
    const data = []
    let paginationData = []
    let displayType = 'card'
    let page = 1  // default page 1

    //get data from API 
    axios.get(INDEX_URL)
    .then((response) => {
        data.push(...response.data.results)
        getTotalPages(data)
        getPageData(page,data)
    })
    .catch((err) => console.log(err))

    userList.addEventListener('click',(event) =>{
        if(event.target.matches('.btn-show-User')){
          showUser(event.target.dataset.id)
        } else if (event.target.matches('.btn-add-favorite')) {
          addFavoriteItem(event.target.dataset.id)
        }  
    })

    searchForm.addEventListener('submit', event => {
        event.preventDefault()
        let input = searchInput.value.toLowerCase()
        let results = data.filter(
            data => data.name.toLowerCase().includes(input)
          )
        getTotalPages(results)
        getPageData(1, results)
      })


    // listen to pagination click event
    pagination.addEventListener('click', (event) => {
        if (event.target.tagName === 'A') {
        page = event.target.dataset.page
        getPageData(event.target.dataset.page)
        }
    })

    // listen to modeSwitch click event
    iconsdisplay.addEventListener ('click', (event) => {
        if (event.target.tagName === 'I') {
        displayType = event.target.id
        getPageData(page,paginationData) 
        }
    })

    

   
    function displayDataList(data){
    let htmlContent = ''
    if (displayType === 'card') {
        data.forEach(item => {
            htmlContent +=
            `<div class="col-sm-3">
                <div style="width:11rem;">
                    <img src="${item.avatar}" class="card-img-top rounded-circle" alt="..." >
                    <div class="card-body center">
                        <h5 class="card-title"> ${item.name}</h5>
                        <p class="card-text">Age : ${item.age}</p>
                        <div>
                        <button href="#" class="btn btn-outline-info btn-show-User" data-toggle="modal" data-target="#show-user-modal" data-id="${item.id}">More...</button>
                        <button class="btn btn-outline-danger btn-add-favorite" data-id="${item.id}"><i class="fa fa-heart" aria-hidden="true"></i></button>
                        </div>
                    </div>
                </div>
            </div>
            `
        })
    }
    else if (displayType === 'list') {  
        data.forEach(function (item, index) {
        htmlContent += ` 
        <ul class="list-group list-group-flush col-12">
         <li class="list-group-item d-flex nowrap justify-content-between">
          <div class="col-6">
            <h5 class="card-title">${item.name}</h5>   
          </div>
          <div class="col-2">
          <!-- "More" button -->
          <button href="#" class="btn btn-outline-info btn-show-User" data-toggle="modal" data-target="#show-user-modal" data-id="${item.id}">More</button>
          <!-- favorite button --> 
          <button class="btn btn-outline-danger btn-add-favorite" data-id="${item.id}"><i class="fa fa-heart" aria-hidden="true"></i></button>
          </div>
          </li>
        </ul>
        `
      })
      }
      userList.innerHTML = htmlContent
    }


    

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
            userBirthday.innerHTML = `${icon.birthday} <br> ${data.birthday}`
            console.log(userBirthday)
            userEmail.innerHTML = `${icon.email} <br> ${data.email}`
        })
        .catch((err) => console.log(err))
    }



    function addFavoriteItem (id){
        const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
        const user = data.find(item => item.id === Number(id))
        if (list.some(item => item.id === Number(id))){
            alert(`${user.name} is already in your favorite list.`)
        } else {
          list.push(user)
          alert(`Added ${user.name} to your favorite list!`)
        }
        localStorage.setItem('favoriteMovies', JSON.stringify(list))
    }


    function getTotalPages(data){
        let totalPages = Math.ceil(data.length/ITEM_PER_PAGE ) || 1
        let pageItemContent = ''
        for (let i = 0; i<totalPages ;i++) {
            pageItemContent +=`
            <li class="page-item">
             <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
            </li>
            ` 
        }
    pagination.innerHTML = pageItemContent
    }

    
    
    function getPageData (pageNum, data) {
      paginationData = data || paginationData
      let offset = (pageNum - 1) * ITEM_PER_PAGE
      let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
      displayDataList(pageData)
    }

    
})()