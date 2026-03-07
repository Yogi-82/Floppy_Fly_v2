kaboom({
    width: 320,    // Szerokość Twojej sceny (możesz dopasować pod swoje tło)
    height: 480,   // Wysokość Twojej sceny
    letterbox: true, // Magiczny przełącznik - koniec z szachownicą!
    scale: 1,      // Podstawowa skala (silnik i tak dopasuje ją do okna)
    background: [99, 155, 255], // Twoje niebieskie tło (zamiast rgb w manifeście)
})

if("serviceWorker" in navigator){
    navigator.serviceWorker.register("./sw.js")
        .then(()=> console.log("Magazynier (Service Worker) zatrudniony"))
        .catch((err) => console.log("Magazynier nie przyszedł do pracy: ", err))
}

setGravity(2400)

loadSprite('background', './background_forest1.png')

loadFont("retro", './Minecraft.ttf')

loadSprite('player', "./fly.png",{
    sliceX: 3,
    anims:{
        idle:{from: 0, to: 2, loop: true}
    }
})

loadSprite('pirania', './pirahna_plant — kopia.png')

const hitboxRozmiar =  vec2(0.25, 0.95)
const backgroundHeight = 200;

scene('start', ()=>{
    add([
    sprite('background'),
    pos(0,0),
    scale(height() / backgroundHeight),
    fixed()
    ])
    add([
        sprite("player", {
            anim: 'idle',
        }),
        pos(80, height() / 2),
        scale(8)
    ])
    const title = add([
        text('Floppy Fly',{
            font: 'retro',
            size: 45
        }),
        pos(width() / 2, height() / 2 - 50),
        anchor('center')
    ])
/*     let highScore = localStorage.getItem('highScore')
    if (highScore == null){
        highScore = 0
    }
    const highScoreText = add([
        text("High Score: "),
        pos(width() / 2, height() / 2 + 50),
        anchor('center'),
        {value: 0}
    ])
    highScoreText.value = highScore
    highScoreText.text = "High Score: " + highScoreText.value */
    const press_key = add([
        text("Press space to play!",{
            font: 'retro',
            size: 38
        }),
        anchor('center'),
        pos(width() / 2, height() / 2 + 50),
        opacity(1)
    ])
    onKeyPress('space', () =>{
        go('gra')
        })
    onClick(() => {
        go('gra')
        })
    loop(0.75, ()=>{   
        if (press_key.opacity === 1){
            press_key.opacity = 0
        }else{
            press_key.opacity = 1
        }
    })
})


scene('gra', () =>{
    const background1 = add([
    sprite('background'),
    pos(0,0),
    scale(5,height() / backgroundHeight + 0.1),
    fixed(),
    move(LEFT, 50),
    'tlo'
    ])

    const background2 = add([
        sprite('background'),
        pos(width(),0),
        scale(5,height() / backgroundHeight + 0.1),
        fixed(),
        move(LEFT, 50),
        'tlo'
    ])

    onUpdate('tlo', (p) => {
        if (p.pos.x <= - width()){
            p.pos.x = width()
        }
    })


    let highScore 
    if (localStorage.getItem('highScore') == null){
        highScore = 0
    }else{
        highScore = localStorage.getItem('highScore')
    }

    let score = add([
    text("Score:", {
        font: 'retro'
    }),
    pos(24, 24),
    { value: 0 },
    z(100)
    ])
    score.text = "Score: " + score.value

    let highScoreText = add([
    text("High score:",{
        font: 'retro'
    }),
    pos(24, 60),
    { value: 0 },
    z(100)
    ])

    highScoreText.value = highScore;
    highScoreText.text = "High score: " + highScoreText.value


    const player = add([
        sprite("player", {
            anim: 'idle',
        }),
        pos(80, height() / 2),
        anchor('center'), //? wyśrodkowuje hitboxa
        area({scale: 0.35,
            shape: new Rect(vec2(0), 10, 10), // Tworzy mniejszy kwadrat kolizji
        }), 
        body(),
        scale(8)
    ])
    const getRandomNumber = (min, max) =>{
        return Math.random() * (max - min) + min
    }



    loop(2, () => {
        const center = getRandomNumber(100, 500);
        const gap = 10;
        let punkt = add([
            pos(width(), center),
            rect(20, gap),    // Tworzy prostokąt o szerokości 20 i wysokości Twojej przerwy (gap)
            opacity(0),       // Robi go w 100% niewidzialnym
            move(LEFT, 200),
            area(),
            anchor('center'),
            'punkt'
        ])

        const dolna = add([
        sprite('pirania'),
        pos(width(), center + gap / 2),
        anchor('center'),
        scale(8),
        area({scale: hitboxRozmiar}),
        move(LEFT, 200),
        offscreen({destroy: true}),
        "pirania" ])

        const gorna = add([
        sprite('pirania', {flipY: true}),
        pos(width(), center - gap / 2 ),
        anchor('center'),
        scale(8),
        area({scale: hitboxRozmiar}),
        "pirania" ])
    


        gorna.onUpdate(() => {
            if (dolna.pos) {
                gorna.pos.x = dolna.pos.x; // Co klatkę ustawia swój X na ten sam, co u Szefa
            }
        });

    // 4. Kiedy Szef ginie (bo wyleciał za ekran), zabiera ze sobą Naśladowcę
        dolna.onDestroy(() => {
            destroy(gorna);
        });
    })

    player.onCollide('punkt', (p) => {
        score.value += 1
        score.text = "Score:" + " " + score.value
        destroy(p)
        if(score.value > highScoreText.value){
            highScoreText.value = score.value
            highScoreText.text = "High score: " + highScoreText.value
            localStorage.setItem('highScore', highScoreText.value)
        }
    })

    onKeyPress("space", () => {
        player.jump()   
    })
    onClick(() => {
        player.jump()   
    })


    player.onCollide("pirania", () => {
        destroy(player)
        addKaboom(player.pos) // Fajny efekt wybuchu!
        wait(1, () => location.reload()) // Restart gry po sekundzie
    })

    player.onUpdate(() => {
        // Sprawdzamy, czy gracz wyleciał za sufit (Y < 0) 
    // LUB (znak ||) czy spadł na podłogę (Y > height())
        if (player.pos.y < 0 || player.pos.y > height()) {
        
        // Tutaj wklejamy dokładnie to samo, co przy zderzeniu z piranią
            destroy(player)
            addKaboom(player.pos)
            //wait(1, () => location.reload())
            wait(1, () => {go('koniec', score.value)})
        }
    })
//debug.log("Szerokość: " + width() + " Wysokość: " + height())
})
scene('koniec', (zdobytePunkty)=>{
    add([
    sprite('background'),
    pos(0,0),
    scale(5,height() / backgroundHeight + 0.1),
    fixed()
    ])
    add([
        text('Game Over', {
            font: 'retro',
            size: 36
        }),
        pos(width()/2, height()/2 - 100),
        anchor('center')
    ])
    add([
        text('Score: ' + zdobytePunkty,{
            font: 'retro',
            size: 28
        }),
        pos(width()/2, height()/2 - 10),
        anchor('center')
    ])
    add([
        text('High Score: ' + localStorage.getItem('highScore'),{
            font: 'retro',
            size: 28
        }),
        pos(width()/2, height()/2 + 50),
        anchor('center')
    ])
    const migajacyNapis = add([
        text("Press space to retry!",{
            font: 'retro',
            size: 28
        }),
        anchor('center'),
        pos(width() / 2, height() / 2 + 150),
        opacity(1),
        'napis'
    ])
    loop(0.75, ()=>{   
        if (migajacyNapis.opacity === 1){
            migajacyNapis.opacity = 0
        }else{
            migajacyNapis.opacity = 1
        }
    })
    onKeyPress('space', () =>{
        go('gra')
    })
    onClick(() =>{
        go('gra')
    })

})
go('start')