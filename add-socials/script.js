function formFieldFocused(inputElement) {
    const name = inputElement.name.substring(7);
    var elementIdToHide = "edit-icon-".concat(name);
    var editIcon = document.getElementById(elementIdToHide);
    editIcon.style.display = "none";

    // const titleInputElementName = "social_title";
    // const urlInputElementName = "social_url";

    // if (titleInputElementName && titleInputElementName.value.length > 0 && urlInputElementName && urlInputElementName.value.length > 0) {
    //     const enableButton = document.getElementById("btn-enable");
    //     enableButton.disabled = false;
    //     enableButton.style.opacity = 1.0;
    // }
}

function onInputFieldEdited() {
    const enableButton = document.getElementById("btn-enable");
    enableButton.disabled = false;
    enableButton.style.opacity = 1.0;

    // const titleInputElementName = document.getElementById("social_title");
    // const urlInputElementName = document.getElementById("social_url");

    // if (titleInputElementName && titleInputElementName.value.length > 0 && urlInputElementName && urlInputElementName.value.length > 0) {
    //     const enableButton = document.getElementById("btn-enable");
    //     enableButton.disabled = false;
    //     enableButton.style.opacity = 1.0;
    // }
}

function formFieldBlurred(inputElement) {

    if (inputElement.value.length == 0) {
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
    li.id = 'new-social-card-template';
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

function submitSocialsDetail() {
    let socialTextInput = document.getElementById("social_title");
    let socialUrlInput = document.getElementById("social_url");

    console.log(socialTextInput.value);
    console.log(socialUrlInput.value);

    var jsonObj = {
        "socialTitle": socialTextInput.value,
        "socialUrl": socialUrlInput.value
    }

    console.log(jsonObj);
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

function previewImageAndUpload(event) {

    if (event.target.files.length > 0) {
        var src = URL.createObjectURL(event.target.files[0]);
        
        const file = event.target.files[0];
        
        const extension = file.name.substring(file.name.lastIndexOf('.') + 1);

        // console.log("file extension: " + extension);

        const fileMb = file.size / 1024 ** 2;
        // console.log('File size: ' + fileMb);
        
        if(fileMb > 2) {
            alert('Please select a file less than 2MB in size');
            return;
        }
        
        var preview = document.getElementById('thumbnail-preview');
        preview.src = src;
        preview.style.display = "block";

        // getBase64(file);
        
        let formData = new FormData();
        formData.set('file', file);

        var data = JSON.stringify({
            "body": getBase64(file),
            "extension": extension
        })

        var config = {
            method: 'post',
            url: 'https://zswm2a102j.execute-api.us-east-1.amazonaws.com/dev/socials/upload',
            headers: { 
              'Content-Type': 'application/json',
              'Accept':'*/*',
              'Access-Control-Allow-Origin': 'http://localhost:5500',
              'Access-Control-Allow-Credentials': 'true'
            },
            data : data
          };

          axios(config)
          .then(function (response) {
            console.log(JSON.stringify(response.data));
          })
          .catch(function (error) {
            console.log(error);
          });
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

function getBase64(file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        var base64String = reader.result;
        const base64Prefix = 'data:image/svg+xml;base64,'
        if(base64String.startsWith(base64Prefix)) {
            base64String = base64String.slice(base64Prefix.length);
        }
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
 }