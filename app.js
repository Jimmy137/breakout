const blockWidth = 100
const blockHeight = 20
const boardkWidth = 600
const boardkHeight = 300
const ballDaiameter = 20
let ballSpeed = 1
const milliseconds = 50

class Block {
    constructor(x,y){
        this.leftBottom = [x,y]
        this.leftTop = [x , y + blockHeight]
        this.rightTop = [x + blockWidth, y + blockHeight]
        this.rightBottom = [x + blockWidth, y]
    }
}

let blocks = []

const addBlocksToArr = () => {
    for (let i = 0; i < 15; i++) {
        x= i +40
        y = i +240
        if (i != 0) {
            x = blocks[i-1].rightBottom[0] + 5
            y = blocks[i-1].rightBottom[1]
            if (i%5 == 0) {
                y = blocks[i-1].rightBottom[1] - 25
                x = blocks[i-5].leftBottom[0]
            }
        }
        const block = new Block(x,y)
        blocks.push(block)
    }
    console.log(blocks)
}

addBlocksToArr()

const scoreDisplay = document.querySelector('#score')
const livesDisplay = document.querySelector('.lives')
const instructionsDisplay = document.querySelector('.instructions')
const message = document.createElement('h4')
let lives = [0,1,2]

const generateLivesIcons = ()=>{
    livesDisplay.innerHTML = ''
    
    for (let i=0; i<lives.length ;i++) {
        const heart = document.createElement('div')
        heart.classList.add('heart')
        livesDisplay.append(heart)
    }
}

generateLivesIcons()

let blocksDisplay;
const container = document.querySelector('#container')
const gridDisplay = document.querySelector('.grid')
const generateBasic = ()=> {
    for (let i = 0; i < blocks.length; i++) {
        const block = document.createElement('div')
        block.setAttribute('data-id', i+1)
        block.classList.add('block')
        block.style.left = blocks[i].leftBottom[0] + 'px'
        block.style.bottom = blocks[i].leftBottom[1] + 'px'
        gridDisplay.append(block)
    }
    
}
generateBasic()

//stick


let CurrentPosition;

const stick = document.createElement('div')

const createStick = () => {
    const StartPosition = [220, 10]
    CurrentPosition = StartPosition
    stick.classList.add('stick')
    stick.style.left = CurrentPosition[0] + 'px'
    stick.style.bottom = CurrentPosition[1] + 'px'
    gridDisplay.append(stick)
}

createStick()

//move stick
const moveStick = (e)=> {
    
    switch(e.key){
        case 'ArrowLeft':
            if (CurrentPosition[0] > 10) {
                CurrentPosition[0] -= 10
                stick.style.left = CurrentPosition[0] + 'px'
            }
            break

        case 'ArrowRight':
            if (CurrentPosition[0] <= 430) {
                CurrentPosition[0] += 10
                stick.style.left = CurrentPosition[0] + 'px'
            }   
    }
}



//ball

let ballCurrentPosition;
let ballCurrentDirection = [1,1]
let alive = true

const ball = document.createElement('div')

const createBall = () => {
    const ballStartPosition = [285, 30]
    ballCurrentPosition = ballStartPosition
    ball.classList.add('ball')
    ball.style.left = ballCurrentPosition[0] + 'px'
    ball.style.bottom = ballCurrentPosition[1] + 'px'
    gridDisplay.append(ball)
}

createBall()

//game play

const moveBall  = (xSign, ySign)=>{
    if (alive){
        message.innerHTML = ''
        document.removeEventListener('keydown',startOverEvent)
        ballCurrentDirection = [xSign, ySign]
        ballCurrentPosition[0] += (xSign*ballSpeed)
        ballCurrentPosition[1] += (ySign*ballSpeed)
        ball.style.left = ballCurrentPosition[0] + 'px'
        ball.style.bottom = ballCurrentPosition[1] + 'px'
        manageCollisiions(xSign, ySign)
    }
}
    

let moveBallInterval


const manageCollisiions = (xSign, ySign) => {
    if (alive){
        // walls collisions
        if (ballCurrentPosition[0] >= (boardkWidth - ballDaiameter)) {
            changeDirection(-xSign,ySign)
        }
        if (ballCurrentPosition[1] >= (boardkHeight - ballDaiameter)) {
            changeDirection(xSign,-ySign)
        }
        if (ballCurrentPosition[0] <= 0 ) {
            changeDirection(-xSign,ySign)
        }

        //Game over
        if (ballCurrentPosition[1] <= 0) {
            //changeDirection(xSign,-ySign)
            clearInterval(moveBallInterval)  
            alive = false  
            document.removeEventListener('keydown', moveStick)
            Button.removeEventListener('click', pauseResume)    
            lives.pop()
            generateLivesIcons()
            startOver()
            

        }
        //corners
        if (ballCurrentPosition[0] >= (boardkWidth - ballDaiameter) && ballCurrentPosition[1] >= (boardkHeight - ballDaiameter)) {
            changeDirection(-xSign,-ySign)
        }
        if (ballCurrentPosition[0] <= 0 && ballCurrentPosition[1] >= (boardkHeight - ballDaiameter)) {
            changeDirection(-xSign,-ySign)
        }

        //blocks
        let x = ballCurrentPosition[0]
        let y = ballCurrentPosition[1]
        blocksDisplay= document.querySelectorAll('.block')
        for (let i = 0; i< blocks.length; i++){
            let b = blocks[i]
            let left = b.leftBottom[0] - ballDaiameter
            let right = b.rightBottom[0] - ballDaiameter
            let bottom = b.rightBottom[1] - ballDaiameter
            let top =  b.leftTop[1] - ballDaiameter
            if (
                x >= left && x <= right + ballDaiameter && y >= bottom && y <= top + ballDaiameter
            ){
                blocksDisplay[i].classList.remove('block')
                blocks.splice(i,1)
                console.log(blocks)
                
                if (y == bottom) {
                    console.log('bottom', 'y', y, bottom, top)
                    changeDirection(xSign,-ySign)
                }else if ( y == top + ballDaiameter) {
                    console.log('top', 'y', y, bottom, top)
                    changeDirection(xSign,-ySign)
                }else {
                    console.log('A7a', 'y', y, bottom, top)
                }
                if (x == left || x == right + ballDaiameter){
                    changeDirection(-xSign,ySign)
                } 
                if (
                    (y == bottom || y == top) && (x == left || x == right)
                ) {
                    changeDirection(-xSign, -ySign)
                }

            }
        }

        //stick
        const stickHeight = 20 + 10
        const stickWidth = 150
        if (y == stickHeight){
            if (x + ballDaiameter >= CurrentPosition[0] && x <= CurrentPosition[0] + stickWidth){
                changeDirection(xSign,-ySign)
            }
            
        }

        // if (y <= stickHeight && y > 10) {
        //     if (x == CurrentPosition[0] + stickWidth || x == CurrentPosition[0]){
        //         changeDirection(xSign,-ySign)
        //     }
        // }
    }
    
    
}

const changeDirection = (x,y) => {
    clearInterval(moveBallInterval)
    ballCurrentDirection = [x, y]
    moveBallInterval = setInterval(()=>moveBall(x,y), milliseconds)
}


//reume playing after losing

const startOverEvent = (e)=>{
    if (e.code =='Space') {
        alive = true
        gamePlaying = true
        createStick()
        createBall()
        Button.addEventListener('click', pauseResume)
        document.addEventListener('keydown', moveStick)
        moveBallInterval = setInterval(()=>moveBall(1,1), milliseconds)

        
    }

}

const startOver = () => {
    if (lives.length < 3 && lives.length > 0){
        if (gamePlaying && !alive){
            
            message.innerHTML = 'Press Space to start over'
            instructionsDisplay.append(message)
            document.addEventListener('keydown', startOverEvent)

            
        }
    }else if (lives.length == 0) {
        alert('Game Over')
    }
}

//pause or resume game
const Button = document.createElement('button')
Button.setAttribute('class', 'resume')

let gamePlaying = false
const pauseResume = ()=> {

    if (alive){
        if (gamePlaying) {
            Button.setAttribute('class', 'resume')
            clearInterval(moveBallInterval)
            moveBallInterval = null
        }else {
            document.addEventListener('keydown', moveStick)
            Button.setAttribute('class', 'pause')
            moveBallInterval = setInterval(()=>moveBall(...ballCurrentDirection), milliseconds)
        }

        Button.blur()
        gamePlaying = !gamePlaying
    }
    
    
}
Button.addEventListener('click', pauseResume)



container.append(Button)

