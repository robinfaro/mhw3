/* TODO: inserite il codice JavaScript necessario a completare il MHW! */

function isSelected(box){
    for(c of box.classList){
        if(c == 'selected-img')
        {
            return true;
        }
    }

    return false;
}

function otherSelected(index){
    const boxes = document.querySelectorAll('.choice-grid div');

    for(const box of boxes){
        if(box.dataset.questionId == index && isSelected(box)){
            return true
        }
    }

}

function countSelected()
{
    const boxes = document.querySelectorAll('.choice-grid div');
    let i = 0
    for(const box of boxes){
        if(isSelected(box)){
            i = i + 1;
        }
    }
    return i;
    

}

function getFirstAnswer()
{
    const boxes = document.querySelectorAll('.choice-grid div');

    for(const box of boxes){
        if(isSelected(box)){
            return box.dataset.choiceId;
        }
    }

}

function computeResult()
{
    const choices = 
    {
        blep : 0,
        burger : 0,
        cart : 0,
        dopey : 0,
        happy : 0,
        nerd : 0,
        shy : 0,
        sleeping : 0,
        sleepy : 0

    };
    const boxes = document.querySelectorAll('.choice-grid div');

    for(const box of boxes){
        if(isSelected(box)){
            //let qNumber = box.dataset.questionId;
            let qChoice = box.dataset.choiceId;
            choices[qChoice] = choices[qChoice] + 1;
        }
    }

    winner = getFirstAnswer();

    for(let id in choices){
        if(choices[id] >= 2){
            winner = id
        }
    }

    //console.log(winner)

    const resTitle = document.querySelector('#quiz .hidden h1');
    resTitle.textContent = RESULTS_MAP[winner]['title'];

    const resDesc = document.querySelector('#quiz .hidden div');
    resDesc.textContent = RESULTS_MAP[winner]['contents'];

    const res = document.querySelector('#quiz .hidden');
    res.classList.add('final-result');
    res.classList.remove('hidden');


}


function getIndex(id){
    if(id == 'one'){
        return 0
    }
    if(id == 'two'){
        return 1
    }

    return 2
}

function onClick(event)
{
    const box= event.currentTarget;
    const checkbox = box.querySelectorAll('img')[1];
    const otherBoxes = []
    const grids = document.querySelectorAll('.choice-grid')
    for (const g of grids){
        if(g.dataset.questionId == box.dataset.questionId){
            const innerBoxes = g.querySelectorAll('div')
            for(const ib of innerBoxes){
                if(ib != box){
                    otherBoxes.push(ib)
                }
            }
        }
    }

    if (isSelected(box))
    {
        box.classList.remove("selected-img");
        checkbox.src = './images/unchecked.png';
        for(ob of otherBoxes){
            ob.classList.remove('unchosen')
        }
    }

    else{

        if(otherSelected(box.dataset.questionId))
        {
           const thisGrid = document.querySelectorAll('.choice-grid')[getIndex(box.dataset.questionId)]
           const selectedBox = thisGrid.querySelector('.selected-img')
           selectedBox.classList.remove('selected-img')
           selectedBox.querySelectorAll('img')[1].src = './images/unchecked.png';

        }
        box.classList.remove('unchosen');
        box.classList.add("selected-img");
        checkbox.src = './images/checked.png';
        for(ob of otherBoxes){
            ob.classList.add('unchosen')
        }

    }

    if(countSelected()==3){
        const boxes = document.querySelectorAll('.choice-grid div');

        for(const b of boxes){
            b.removeEventListener('click', onClick);
        }   

       computeResult();

    }
}

function reset(event){
    const boxes = document.querySelectorAll('.choice-grid div');

    for(const b of boxes){
        if(isSelected(b)){
            b.classList.remove("selected-img");
            b.querySelectorAll('img')[1].src = './images/unchecked.png';
        }

        b.classList.remove('unchosen')

        b.addEventListener("click", onClick)
    }

    const res =document.querySelector('.final-result')
    res.classList.remove('final-result')
    res.classList.add('hidden')
}

const boxes = document.querySelectorAll('.choice-grid div');

for(const box of boxes){
    box.addEventListener('click', onClick);
}

const button = document.querySelector('#quiz button');
button.addEventListener("click", reset)