for (let i = 0; i < allCells.length; i++) {
    allCells[i].addEventListener("blur", function () {
        let data = allCells[i].innerText;
        let address = addressInput.value;
        console.log(allCells[i]);
        let rid = allCells[i].getAttribute("rid");
        let cid = allCells[i].getAttribute("cid");
        let cellObject = sheetDB[rid][cid];
        if (cellObject.value == data) {
            return;
        }
        if (cellObject.formula) {
            removeFormula(cellObject, address);
            formulaBar.value = "";
        }
        
        cellObject.value = data;
       
        updateChildren(cellObject);
    })
}

function removeFormula(cellObject, myName) {
    
    let formula = cellObject.formula;
    let formulaTokens = formula.split(" ");
    for (let i = 0; i < formulaTokens.length; i++) {
        let ascii = formulaTokens[i].charCodeAt(0);
        if (ascii >= 65 && ascii <= 90) {
            let { rid, cid } = getRIDCIDfromAddress(formulaTokens[i]);
            let parentObj = sheetDB[rid][cid];
            let idx = parentObj.children.indexOf(myName);
            parentObj.children.splice(idx, 1);
        }
    }
    cellObject.formula = "";
}

formulaBar.addEventListener("keydown", function (e) {

    if (e.key == "Enter" && formulaBar.value) {
       
        let currentFormula = formulaBar.value;
        let address = addressInput.value;
        let { rid, cid } = getRIDCIDfromAddress(address);
        let cellObject = sheetDB[rid][cid];
       
        
        if (currentFormula != cellObject.formula) {
            removeFormula(cellObject, address);
        }
       
        let value = evaluateFormula(currentFormula);
        
        setCell(value, currentFormula);
        
        setParentCHArray(currentFormula, address);
        updateChildren(cellObject);
    }
})

function evaluateFormula(formula) {
   
    let formulaTokens = formula.split(" ");
    for (let i = 0; i < formulaTokens.length; i++) {
        let ascii = formulaTokens[i].charCodeAt(0);
        if (ascii >= 65 && ascii <= 90) {
            let { rid, cid } = getRIDCIDfromAddress(formulaTokens[i]);
            let value = sheetDB[rid][cid].value;
            if (value == "") {
                value = 0;
            }
            formulaTokens[i] = value;
        }
    }
   
    let evaluatedFormula = formulaTokens.join(" ");
   
    return eval(evaluatedFormula);
}
function setCell(value, formula) {
    let uicellElem = findUICellElement();
    uicellElem.innerText = value;
   
    let { rid, cid } = getRIDCIDfromAddress(addressInput.value);
    sheetDB[rid][cid].value = value;
    sheetDB[rid][cid].formula = formula;
}
function findUICellElement() {
    let address = addressInput.value;
    let ricidObj = getRIDCIDfromAddress(address);
    let rid = ricidObj.rid;
    let cid = ricidObj.cid;
    let uiCellElement =
        document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`)
    return uiCellElement;
}
function getRIDCIDfromAddress(address) {
    let cid = Number(address.charCodeAt(0)) - 65;
    let rid = Number(address.slice(1)) - 1;
    return { "rid": rid, "cid": cid };
}
function setParentCHArray(formula, chAddress) {
 
    let formulaTokens = formula.split(" ");
    for (let i = 0; i < formulaTokens.length; i++) {
        let ascii = formulaTokens[i].charCodeAt(0);
        if (ascii >= 65 && ascii <= 90) {
            let { rid, cid } = getRIDCIDfromAddress(formulaTokens[i]);
            let parentObj = sheetDB[rid][cid];
            parentObj.children.push(chAddress);

        }
    }
}
function updateChildren(cellObject) {
    let children = cellObject.children;
    for (let i = 0; i < children.length; i++) {
       
        let chAddress = children[i];
        let { rid, cid } = getRIDCIDfromAddress(chAddress);
       
        let childObj = sheetDB[rid][cid];
        
        let chFormula = childObj.formula;
        let newValue = evaluateFormula(chFormula);
        SetChildrenCell(newValue, chFormula, rid, cid);
      
        updateChildren(childObj);
    }
}
function SetChildrenCell(value, formula, rid, cid) {
     
    let uiCellElement =
        document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
    uiCellElement.innerText = value;
    sheetDB[rid][cid].value = value;
    
}