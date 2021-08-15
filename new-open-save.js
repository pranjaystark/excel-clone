let save = document.querySelector(".save");
let open = document.querySelector(".open");
save.addEventListener("click", function () {
    const data = JSON.stringify(sheetArray);
    const blob = new Blob([data], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = "file.json";
    a.click();
})

open.addEventListener("change", function () {
  
    let filesArray = open.files;

    let fileObj = filesArray[0];
    
    let fr = new FileReader();
    
    fr.readAsText(fileObj);
    fr.onload = function () {
        
        console.log(fr.result);
       
        let sheetArray = fr.result;
        sheetDB = sheetArray[0];
       
    }
    fr.addEventListener("load", function () {
        console.log(fr.result);

    })

    console.log("After");
    
})
