let jogador, velocidadeJogador, velocidadeTiro, ajusteTiro
let direcaoJogadorY, direcaoJogadorX, posicaoJogadorX, posicaoJogadorY
let tamanhoTelaLargura, tamanhoTelaAltura, topoTela, telaMensagem
let jogoAtivo, frames, vidaPlaneta, barraPlaneta
let contagemBombas, contadorBombas, bombas, velocidadeBomba, frequenciaBomba
let danoBomba, tempoCriaBomba, indiceExplosao, indiceSom

function teclaBaixa() {
    let tecla = event.keyCode

    if (jogoAtivo) {
        if (tecla == 38) { //Cima
            direcaoJogadorY = - 1
        } else if (tecla == 40) { //Baixo
            direcaoJogadorY = 1
        }

        if (tecla == 37) { //Esquerda
            direcaoJogadorX = - 1
        } else if (tecla == 39) { //Direita
            direcaoJogadorX = 1
        }

        if (tecla == 32) { //Espaço
            //Tiro
            atira(posicaoJogadorX + ajusteTiro, posicaoJogadorY)
        }
    }
}

function teclaCima() {
    let tecla = event.keyCode

    if (tecla == 38 || tecla == 40) { //Cima ou Baixo
        direcaoJogadorY = 0
    }

    if (tecla == 37 || tecla == 39) { //Esquerda ou Direita
        direcaoJogadorX = 0
    } 
}

function controlaJogador() {
    posicaoJogadorY += direcaoJogadorY * velocidadeJogador
    posicaoJogadorX += direcaoJogadorX * velocidadeJogador
    jogador.style.top = posicaoJogadorY + "px"
    jogador.style.left = posicaoJogadorX + "px"
}

function atira(x, y) {
    let tiro = document.createElement("div")
    let atributo1 = document.createAttribute("class")
    let atributo2 = document.createAttribute("style")

    atributo1.value = "tiroJogador"
    atributo2.value = "top:" + y + "px; left:" + x + "px;"

    tiro.setAttributeNode(atributo1)
    tiro.setAttributeNode(atributo2)

    document.body.appendChild(tiro)
}

function controlaTiros() {
    let tiros = document.getElementsByClassName("tiroJogador")
    let tamanho = tiros.length

    for(let i = 0; i < tamanho; i++) {
        if (tiros[i]) {
            let posicaoTiro = tiros[i].offsetTop

            posicaoTiro -= velocidadeTiro

            tiros[i].style.top = posicaoTiro + "px"

            colisaoTiroBomba(tiros[i])

            if(posicaoTiro < topoTela) {
                document.body.removeChild(tiros[i])
                //tiros[i].remove()
            }
        }  
    };
}

function criaBomba() {
    if (jogoAtivo) {
        let y = topoTela
        let x = Math.random() * tamanhoTelaLargura
        let bomba = document.createElement('div')
        let atributo1 = document.createAttribute("class")
        let atributo2 = document.createAttribute("style")
    
        atributo1.value = "bomba"
        atributo2.value = "top:" + y + "px; left:" + x + "px;"

        bomba.setAttributeNode(atributo1)
        bomba.setAttributeNode(atributo2)
        
        document.body.appendChild(bomba)

        contagemBombas--    

        if (contagemBombas % 10 === 0) {
            velocidadeBomba++
            tempoCriaBomba -= 200
            
            clearInterval(tempoCriaBomba)
            
            tempoCriaBomba = setInterval(criaBomba, frequenciaBomba)
        }
    }
}

function controlaBomba() {
    bombas = document.getElementsByClassName("bomba")
    let tamanho = bombas.length

    for(let i = 0; i < tamanho; i++) {
        if (bombas[i]) {
            let posicaoBomba = bombas[i].offsetTop

            posicaoBomba += velocidadeBomba

            bombas[i].style.top = posicaoBomba + "px"

            if(posicaoBomba >= tamanhoTelaAltura) {
                vidaPlaneta -= danoBomba

                criaExplosao(2, bombas[i].offsetLeft, null)

                bombas[i].remove()
            }
        }  
    };
}

function colisaoTiroBomba(tiro) {
    let tamanhoBombas = bombas.length

    for(let i = 0; i < tamanhoBombas; i++) {
        if (bombas[i]) {
            if (tiro.offsetTop <= (bombas[i].offsetTop + bombas[i].clientHeight) //Cima tiro com baixo bomba
            && (tiro.offsetTop + tiro.clientHeight) >= bombas[i].offsetTop //Baixo tiro com cima bomba
            && tiro.offsetLeft <= (bombas[i].offsetLeft + bombas[i].clientWidth) //Esquerda tiro com direita bomba
            && (tiro.offsetLeft + tiro.clientWidth) >= bombas[i].offsetLeft) { //Direita tiro com esquerda bomba
                criaExplosao(1, bombas[i].offsetLeft - bombas[i].clientWidth / 2, bombas[i].offsetTop)
                
                bombas[i].remove()
                tiro.remove()
            }
        }
    }    
}

function colisaoJogadorBomba() {
    let tamanhoBombas = bombas.length

    for(let i = 0; i < tamanhoBombas; i++) {
        if (bombas[i]) {
            if (jogador.offsetTop <= (bombas[i].offsetTop + bombas[i].clientHeight) //Cima tiro com baixo bomba
            && (jogador.offsetTop + jogador.clientHeight) >= bombas[i].offsetTop //Baixo tiro com cima bomba
            && jogador.offsetLeft <= (bombas[i].offsetLeft + bombas[i].clientWidth) //Esquerda tiro com direita bomba
            && (jogador.offsetLeft + jogador.clientWidth) >= bombas[i].offsetLeft) { //Direita tiro com esquerda bomba
                criaExplosao(1, bombas[i].offsetLeft - bombas[i].clientWidth / 2, bombas[i].offsetTop)
                
                bombas[i].remove()
            }
        }
    }    
}

function criaExplosao(tipo, x, y) { //Tipo 1 = Ar, Tipo 2 = Terra
    if (document.getElementById("explosao" + (indiceExplosao - 1))) { 
        document.getElementById("explosao" + (indiceExplosao - 1)).remove()
    }

    let explosao = document.createElement("div")
    let imagem = document.createElement("img")
    let som = document.createElement("audio")

    //Atributos para div
    let atributoDiv1 = document.createAttribute("class")
    let atributoDiv2 = document.createAttribute("style")
    let atributoDiv3 = document.createAttribute("id")

    //Atributos para img
    let atributoImg1 = document.createAttribute("src")

    //Atributos para audio
    let atributoAudio1 = document.createAttribute("src")
    let atributoAudio2 = document.createAttribute("id")
    
    if (tipo === 1) {
        atributoDiv1.value = "explosaoAr"
        atributoDiv2.value = "top:" + y + "px; left:" + x + "px;"    
        atributoImg1.value = "img/explosao_ar.gif?" + new Date()
    } else {
        atributoDiv1.value = "explosaoTerra"
        atributoDiv2.value = "top:" + (tamanhoTelaAltura - 128) + "px; left:" + (x - 64) + "px;"
        atributoImg1.value = "img/explosao_terra.gif?" + new Date()
    }

    atributoDiv3.value = "explosao" + indiceExplosao
    atributoAudio1.value = "audio/explosao.mp3?" + new Date()   
    atributoAudio2.value = "som" + indiceSom    

    explosao.setAttributeNode(atributoDiv1)
    explosao.setAttributeNode(atributoDiv2)
    explosao.setAttributeNode(atributoDiv3)
    imagem.setAttributeNode(atributoImg1)
    som.setAttributeNode(atributoAudio1)
    som.setAttributeNode(atributoAudio2)
    explosao.appendChild(imagem)
    explosao.appendChild(som)

    document.body.appendChild(explosao)
    
    document.getElementById("som" + indiceSom).play()

    indiceExplosao++
    indiceSom++
}

function gerenciaJogo() {
    barraPlaneta.style.width = vidaPlaneta + "px"
    contadorBombas.innerHTML = "Faltam " + contagemBombas + " bombas"

    if (vidaPlaneta <= 0) 
    {
        jogoAtivo = false

        clearInterval(tempoCriaBomba)

        telaMensagem.style.backgroundImage = "url('img/derrota.jpg')"
        telaMensagem.style.display = "block"
    
        jogador.style.display = "none"

        limpaBombas()
    }
    
    if (contagemBombas <= 0) 
    {
        clearInterval(tempoCriaBomba)

        bombas = document.getElementsByClassName("bomba")

        if (vidaPlaneta <= 0) {
            telaMensagem.style.backgroundImage = "url('img/derrota.jpg')"
            telaMensagem.style.display = "block"
        
            jogador.style.display = "none"
    
            limpaBombas()
        } else if (bombas.length === 0) {
            jogoAtivo = false

            telaMensagem.style.backgroundImage = "url('img/vitoria.jpg')"
            telaMensagem.style.display = "block"
        
            jogador.style.display = "none"
        }
    }
}

function jogoRepeticao() {
    if (jogoAtivo) {
        //Funções de controle
        controlaJogador()
        controlaTiros()
        controlaBomba()
        colisaoJogadorBomba()
        gerenciaJogo()
    }

    frames = requestAnimationFrame(jogoRepeticao)
}

function limpaBombas() {
    bombas = document.getElementsByClassName("bomba")

    while(bombas.length > 0){
        bombas[0].parentNode.removeChild(bombas[0]);
    }

    let tiros = document.getElementsByClassName("tiroJogador")

    while(tiros.length > 0){
        tiros[0].parentNode.removeChild(tiros[0]);
    }
}

function reinicia() {    
    //console.log(indiceExplosao)

    let explosao = document.getElementById("explosao" + (indiceExplosao - 1))

    //console.log(explosao)

    if (explosao) {
        explosao.remove()
    }

    telaMensagem.style.display = "none"
    
    clearInterval(tempoCriaBomba)

    cancelAnimationFrame(frames)
    
    limpaBombas()
    
    vidaPlaneta = 300
    contagemBombas = 100
    posicaoJogadorX = tamanhoTelaLargura / 2
    posicaoJogadorY = tamanhoTelaAltura / 2
    velocidadeBomba = 4
    frequenciaBomba = 1700

    jogador.style.top = posicaoJogadorX + "px"
    jogador.style.left = posicaoJogadorY + "px"    
    jogador.style.display = "block"
    
    ajusteTiro = jogador.clientWidth / 2 - 1.5

    jogoAtivo = true

    tempoCriaBomba = setInterval(criaBomba, frequenciaBomba)

    jogoRepeticao()
}

function inicia() {
    jogoAtivo = false

    //inicialização tela
    tamanhoTelaLargura = window.innerHeight
    tamanhoTelaAltura = window.innerWidth
    topoTela = 100

    //Inicialização jogador
    direcaoJogadorX = direcaoJogadorY = 0
    posicaoJogadorX = tamanhoTelaLargura / 2
    posicaoJogadorY = tamanhoTelaAltura / 2
    velocidadeJogador = 5
    velocidadeTiro = 4
    jogador = document.getElementById("naveJogador")
    
    jogador.style.top = posicaoJogadorX + "px"
    jogador.style.left = posicaoJogadorY + "px"

    //console.log(ajusteTiro)

    //Controles das bombas
    contagemBombas = 100
    velocidadeBomba = 3
    frequenciaBomba = 1700
    danoBomba = 10
    contadorBombas = document.getElementById("contadorBombas")

    contadorBombas.innerHTML = "Faltam " + contagemBombas + " bombas"

    //Controle explosão
    indiceExplosao = indiceSom = 0

    //Controles do planeta
    barraPlaneta = document.getElementById("barraPlaneta")
    
    barraPlaneta.style.width = vidaPlaneta + "px"
    
    //Controles das telas
    telaMensagem = document.getElementById("telaMensagem")

    telaMensagem.style.backgroundImage = "url('img/inicio.jpg')"
    telaMensagem.style.display = "block"

    document.getElementById("botaoJogar").addEventListener("click", reinicia)
}

window.addEventListener("load", inicia)
document.addEventListener("keydown", teclaBaixa)
document.addEventListener("keyup", teclaCima)