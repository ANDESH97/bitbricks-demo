//Fetch socials for id: 63287c8440de249e4c208e52
//Space id: wHwQ1QLKh571DO4Cynake

function loadSocials() {
    
    var config = {
        method: 'get',
        url: 'https://zswm2a102j.execute-api.us-east-1.amazonaws.com/dev/socials/63287c8440de249e4c208e52',
        headers: { },
        data : ''
      };
      
    //   axios(config)
    //   .then(function (response) {

    //     if(response.data.data != null) {
    //         console.log(JSON.stringify(response.data));
    //     }
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });
}

function formFieldFocused(inputElement) {
    document.getElementById(inputElement.id).setAttribute('size', '60');
    const name = inputElement.name.substring(7);
    var elementIdToHide = "edit-icon-".concat(name);
    var editIcon = document.getElementById(elementIdToHide);
    editIcon.style.display = "none";
}

function onInputFieldEdited() {
    const enableButton = document.getElementById("btn-enable");
    enableButton.disabled = false;
    enableButton.style.opacity = 1.0;
}

function formFieldBlurred(inputElement) {

    if (inputElement.value.length == 0) {
        
        document.getElementById(inputElement.id).setAttribute('size', '20');
        var elementToDisplay = "edit-icon-".concat(inputElement.name.substring(7));
        var editIcon = document.getElementById(elementToDisplay);
        editIcon.style.display = "block";
    }

}

async function fetchDefaultPlaceholderCard() {
    // const response = await fetch('http://localhost:7777/placeholderLi', {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'text/html; charset=UTF-8'
    //     }
    // });

    var placeHolderText = document.getElementById("no-socials-placeholder-text");
    placeHolderText.style.display = "none"

    // const myHtml = await response.text();
    // console.log(myHtml);

    // fetch('socials-default-placeholder-card.html')
    //     .then(response => response.text())
    //     .then(
    //         text => {
    //             var ul = document.createElement("ul");
    //             ul.innerHTML = text;
    //             document.getElementById("socials-list").appendChild(ul);
    //         }
    //     );

    const response = await fetch('socials-default-placeholder-card.html');
    const myHtml = await response.text();

    var li = document.createElement("li");
    li.classList.add("add-new-social-card");
    let x = Math.floor((Math.random() * 1000) + 1);
    li.id = 'new-social-card-template-'.concat(x);
    li.innerHTML = myHtml;

    const socialListElement = document.getElementById("socials-list");

    if (socialListElement != null) {
        socialListElement.appendChild(li);
    } else {
        var ul = document.createElement("ul");
        ul.classList.add("socials-list");
        ul.id = 'socials-list';
        ul.appendChild(li);

        document.getElementById("existing-socials-list").appendChild(ul);
    }
}

async function submitSocialsDetail(element) {
    var li = element.closest('li');

    var socialTitleInput = li.querySelector('input.social-title-input');
    var socialUrlInput = li.querySelector('input.social-url-input');
    var socialInputThumnail = li.querySelector('input.social-image-input');

    const file = socialInputThumnail.files[0];
    const extension = file.name.substring(file.name.lastIndexOf('.') + 1);
    const fileMb = file.size / 1024 ** 2;
    
    if(fileMb > 2) {
        alert('Please select a file less than 2MB in size');
        return;
    }    
    
    let formData = new FormData();
    formData.set('file', file);

    var data = JSON.stringify({
        "body": await getBase64(file),
        "extension": extension
    })

    var config = {
        method: 'post',
        url: 'https://zswm2a102j.execute-api.us-east-1.amazonaws.com/dev/socials/upload',
        headers: { 
          'Content-Type': 'application/json',
        },
        data : data
      };

      axios(config)
      .then(function (response) {
        // console.log(JSON.stringify(response.data));
        var jsonObj = {
            "socialKey": socialTitleInput.value,
            "socialValue": socialUrlInput.value,
            "socialThumbnailPath": response.data.data.key
        }
        // console.log(jsonObj);
        createNewSocial(jsonObj);
      })
      .catch(function (error) {
        console.log(error);
      });
}

function createNewSocial(newSocialJson) {

    console.log(newSocialJson);

    var config = {
        method: 'post',
        url: 'https://zswm2a102j.execute-api.us-east-1.amazonaws.com/dev/socials',
        headers: { 
          'Content-Type': 'application/json'
        },
        data : newSocialJson
      };
      
      axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
}

function removeSocial() {

    var socialList = document.getElementById("socials-list");
    socialList.onclick = function (e) {
        var li = e.target.closest('li');
        var nodes = Array.from(socialList.children);
        var index = nodes.indexOf(li);
        socialList.removeChild(socialList.children[index]);

        console.log('socialList child element count: ' + socialList.childElementCount);
        if (socialList.childElementCount == 0) {
            var placeHolderText = document.getElementById("no-socials-placeholder-text");
            placeHolderText.style.display = "block";
        }
    }
}

function getEventTarget(e) {
    e = e || window.event;
    return e.target || e.srcElement;
}

function selectImage() {
    console.log("selecting image");
    var imageUploader = document.getElementById('imageUpload');
    imageUploader.click();
}

async function previewImageAndUpload(event) {

    if (event.target.files.length > 0) {
        var src = URL.createObjectURL(event.target.files[0]);
        // const file = event.target.files[0];
        // const extension = file.name.substring(file.name.lastIndexOf('.') + 1);
        // const fileMb = file.size / 1024 ** 2;
        
        // if(fileMb > 2) {
        //     alert('Please select a file less than 2MB in size');
        //     return;
        // }
        var li = event.target.closest('li');
        
        // var preview = document.getElementById('thumbnail-preview');
        var preview = li.querySelector('img.social-thumbnail-preview');
        preview.src = src;
        preview.style.display = "block";

        // // getBase64(file);
        
        // let formData = new FormData();
        // formData.set('file', file);

        // var data = JSON.stringify({
        //     "body": await getBase64(file),
        //     "extension": extension
        // })

        // console.log('data: \n' + data);

        // var config = {
        //     method: 'post',
        //     url: 'https://zswm2a102j.execute-api.us-east-1.amazonaws.com/dev/socials/upload',
        //     headers: { 
        //       'Content-Type': 'application/json',
        //     //   'Accept':'*/*',
        //     //   'Access-Control-Allow-Origin': 'http://localhost:5500',
        //     // 'Access-Control-Allow-Headers':'Origin',
        //     // 'Access-Control-Request-Headers':'Origin',
        //     //   'Access-Control-Allow-Origin': 'https://bitbricks-demo.herokuapp.com/',
        //     //   'Access-Control-Allow-Credentials': 'true'
        //     },
        //     data : data
        //   };

        //   axios(config)
        //   .then(function (response) {
        //     console.log(JSON.stringify(response.data));
        //   })
        //   .catch(function (error) {
        //     console.log(error);
        //   });
        // axios.post("http://localhost:3001/upload-single-file", formData, {
        //     onUploadProgress: progressEvent => {
        //         const percentCompleted = Math.round(
        //             (progressEvent.loaded * 100) / progressEvent.total
        //         );
        //         console.log(`upload process: ${percentCompleted}%`);
        //     }
        // })
        //     .then(res => {
        //         console.log(res.data)
        //         console.log(res.data.url)
        //     })
    }
}

async function getBase64(file) {
    return new Promise( (resolve, reject) => {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async function () {
            var base64String = reader.result;
            const base64Prefix = 'data:image/png;base64,'
            resolve(base64String.replace(base64Prefix,''));
            // if(base64String.startsWith(base64Prefix)) {
            //     // base64String = base64String.slice(base64Prefix.length);
            //     resolve(base64String.replace(base64Prefix,''));
            // }
        };
        reader.onerror = function (error) {
          console.log('Error: ', error);
        };
    })
    // var reader = new FileReader();
    // reader.readAsDataURL(file);
    // reader.onload = function () {
    //     var base64String = reader.result;
    //     const base64Prefix = 'data:image/svg+xml;base64,'
    //     if(base64String.startsWith(base64Prefix)) {
    //         base64String = base64String.slice(base64Prefix.length);
    //         return base64String;

    //     }
    // };
    // reader.onerror = function (error) {
    //   console.log('Error: ', error);
    // };
 }