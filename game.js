/*Wiadomość dla ciebie ciekawska istoto, to co tu widzisz to jest kamień milowy programisty
który został stworzony na trzeźwo ale czy spełna rozumu? Tego nie wiem*/
kaboom({
    width: 320,
    height: 480,
    letterbox: true,
    background: [99, 155, 255],
})

if("serviceWorker" in navigator){
    navigator.serviceWorker.register("./sw.js")
        .then(()=> console.log("Magazynier (Service Worker) zatrudniony"))
        .catch((err) => console.log("Magazynier nie przyszedł do pracy: ", err))
}

setGravity(2400)
loadSprite('papiez', './sprite/papiez.png')
loadSprite('background', './sprite/background1.png')
loadFont("retro", './font/Minecraft.ttf')
loadSprite('player', "./sprite/fly.png",{
    sliceX: 3,
    anims:{
        idle:{from: 0, to: 2, loop: true}
    }
})
loadSprite('pirania', './sprite/pirahna_plant — kopia.png')
loadSound("jump", './sound/freesound_community-flappy_whoosh-43099.mp3')
loadSound('coin', './sound/universfield-game-bonus-02-294436.mp3')
loadSound('gameover', './sound/universfield-game-over-deep-male-voice-clip-352695.mp3')
loadSound('ambient', './sound/xtremefreddy-game-music-loop-6-144641.mp3')
loadSound('gameover_music', './sound/alphix-game-over-417465.mp3')
loadSound('boom', './sound/bithuh-vine-boom-392646.mp3')
loadSound('mango', './sound/DiscoAdamusSigmaBoy & Rastafarianin Mango67 Viral Tiktok (mp3cut.net).mp3')
loadSound('barka', './sound/barka-made-with-Voicemod.mp3')

const hitboxRozmiar =  vec2(0.25, 0.95)


const music = play('ambient',{
    volume: 0.5,
    loop: true
})


scene('start', ()=>{
    add([
    sprite('background'),
    pos(0,0),
    scale(),
    fixed()
    ])
    add([
        sprite("player", {
            anim: 'idle',
        }),
        pos(0, height() / 2 + 50),
        scale(7)
    ])
    const title = add([
        text('Floppy Fly',{
            font: 'retro',
            size: 45
        }),
        pos(width() / 2, height() / 2 - 50),
        anchor('center')
    ])
        const press_key = add([
        text("Press on screen or space to play!",{
            font: 'retro',
            size: 18
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
    music.play()


    let speed = 200;

    const background1 = add([
    sprite('background'),
    pos(0,0),
    scale(),
    fixed(),
    move(LEFT, 50),
    'tlo'
    ])

    const background2 = add([
        sprite('background'),
        pos(width(),0),
        scale(),
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
    text("", {
        font: 'retro',
        size: '38'
    }),
    pos(width() / 2, 24),
    { value: 0 },
    z(100)
    ])
    score.text = score.value

/*     let highScoreText = add([
    text("High score:",{
        font: 'retro',
        size: '26'
    }),
    pos(24, 60),
    { value: 0 },
    z(100)
    ])

    highScoreText.value = highScore;
    highScoreText.text = "High score: " + highScoreText.value */ // highscore on screen when u play 


    const player = add([
        sprite("player", {
            anim: 'idle',
        }),
        pos(80, height() / 2),
        anchor('center'), //? wyśrodkowuje hitboxa
        area({scale: 0.35,
            shape: new Rect(vec2(0), 10, 10),
        }), 
        body(),
        scale(8)
    ])
    const getRandomNumber = (min, max) =>{
        return Math.random() * (max - min) + min
    }



    function generujRury() {
        const center = getRandomNumber(150, 330);
        const gap = 150;
        const przesuniecie = 180; 

        let punkt = add([
            pos(width(), center),
            rect(20, gap),
            opacity(0),
            move(LEFT, speed),
            area(),
            anchor('center'),
            'punkt'
        ])

        const dolna = add([
            sprite('pirania'),
            pos(width(), center + gap / 2 + przesuniecie),
            anchor('center'),
            scale(6),
            area({scale: hitboxRozmiar}),
            move(LEFT, speed),
            offscreen({destroy: true}),
            "pirania" 
        ])

        const gorna = add([
            sprite('pirania', {flipY: true}),
            pos(width(), center - gap / 2 - przesuniecie ),
            anchor('center'),
            scale(6),
            area({scale: hitboxRozmiar}),
            "pirania" 
        ])

        gorna.onUpdate(() => {
            if (dolna.pos) {
                gorna.pos.x = dolna.pos.x;
            }
        });

        dolna.onDestroy(() => {
            destroy(gorna);
        });
        wait(300 / speed, generujRury);
    }
    generujRury();

    player.onCollide('punkt', (p) => {
        score.value += 1
        play('coin', {
            volume: 0.3
        })
        score.text = score.value
        destroy(p);
        /*   if(score.value > highScoreText.value){
            highScoreText.value = score.value
            highScoreText.text = "High score: " + highScoreText.value
            localStorage.setItem('highScore', highScoreText.value)
        }
 */ // adding points to high score if score is higher than highscore

        if(score.value > 0 && score.value % 20 === 0 && speed < 300 ){
            speed += 10
        }
        if(score.value == 67){
            const mango = play('mango')
            mango.play()
            wait(10, ()=> mango.stop())
        }
        
        if(score.value == 21 && highScoreText.value == 37 || score.value == 2137){
            const papiez = add([
                sprite('papiez'),
            pos(width()/2 - 100, height() / 2),
            move(UP, 200),
            'papiez'
            ])
            const barka = play('barka') 
            barka.play()
            wait(8, () => barka.stop())
            if(papiez.pos.y > 500){
                destroy(papiez)
            }
        }
    })

    onKeyPress("space", () => {
        player.jump()
        play('jump', {
            volume: 0.5
        })   
    })
    onClick(() => {
        player.jump()
        play('jump', {
            volume: 0.5
        })   
    })


    player.onCollide("pirania", () => {
        destroy(player)
        music.stop()
        play('boom')
        addKaboom(player.pos)
        wait(1, () => go('koniec', score.value))
    })

    player.onUpdate(() => {
        if (player.pos.y < 0 || player.pos.y > height()) {
            destroy(player)
            music.stop()
            play('boom')
            addKaboom(player.pos)
            wait(1, () => {go('koniec', score.value)})
        }
    })
})
scene('koniec', (zdobytePunkty)=>{
    play('gameover_music')
    play('gameover')
    add([
    sprite('background'),
    pos(0,0),
    scale(),
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
        text("Press on screen or space to retry!",{
            font: 'retro',
            size: 18
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
