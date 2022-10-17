function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function getCards(){
    return $('.cards').val().split(',');
}

function getValue(card, strength){
    if (card === 'miss') {
        return 0
    } else if (card === 'x2') {
        return strength * 2;
    } else {
        return parseInt(card) + strength
    }
}

function calculateRoll(roll, hitStrength, resultObj, chance){
    if (roll === 'miss') {
        resultObj.missCount++;
        resultObj.hits.push(0);
    } else if (roll === 'x2') {
        resultObj.resultValue += hitStrength * 2;
        resultObj.multipleCount++;
        resultObj.hits.push(hitStrength * 2);
    } else {
        resultObj.resultValue += hitStrength + parseInt(roll);
        resultObj.hits.push(hitStrength + parseInt(roll));
    }

    return resultObj;
}

(function () {
    let defaultCards = ['miss',-2,-1,-1,-1,-1,-1,0,0,0,0,0,0,1, 1, 1, 1, 1,2,'x2'];
    let cbxAdvantage = false;
    let cbxDisadvantage = false;
    
    defaultCards.forEach(card =>  
        {
            $('.cards').append(`${card},`);
        }
        );
        
        $('.cards').val($('.cards').val().slice(0, -1));
        
        $('.advantage').on('change', function(){
            cbxAdvantage =  this.checked;
        })
        
        $('.disadvantage').on('change', function () {
            cbxDisadvantage = this.checked;
        })
        
        $('.btn-calculate').on('click',function(){
            var cards = getCards();
            
            let runs = parseInt($('.number-of-runs').val());
            let hitStrength = parseInt($('.hit-strength').val());
            
            let resultObj = {
                resultValue : 0,
                missCount : 0,
                multipleCount : 0,
                hits : []
            }

            for(var i = 0; i < runs; i++){
                if(cbxAdvantage == cbxDisadvantage){
                    let roll = cards[getRandomInt(cards.length)];
                    resultObj = calculateRoll(roll, hitStrength, resultObj);
                }else if(cbxAdvantage){
                    let cardsDeck = [...cards];
                    let cardIndex1 = getRandomInt(cards.length);
                    let card1 = cardsDeck[cardIndex1];
                    cardsDeck.splice(cardIndex1, 1);
                    let cardIndex2 = getRandomInt(cards.length-1);
                    let card2 = cardsDeck[cardIndex2];
                    
                    let roll;
                    
                    if (getValue(card1, hitStrength) > getValue(card2, hitStrength)){
                        roll = card1;
                    }else{
                        if (card2 !== 'miss') {
                            roll = card2; 
                        }else{
                            roll = card1;
                        }
                    }
                    
                    resultObj = calculateRoll(roll, hitStrength, resultObj);
                }else if(cbxDisadvantage){
                    let cardsDeck = [...cards];
                    let cardIndex1 = getRandomInt(cards.length);
                    let card1 = cardsDeck[cardIndex1];
                    cardsDeck.splice(cardIndex1, 1);
                    let cardIndex2 = getRandomInt(cards.length - 1);
                    let card2 = cardsDeck[cardIndex2];
                    
                    let roll;
                    
                    if (getValue(card1, hitStrength) < getValue(card2, hitStrength)) {
                        roll = card1;
                    } else {
                        if (card2 !== 'miss'){
                            roll = card2;
                        }else{
                            roll = card1;
                        }
                    }

                    resultObj = calculateRoll(roll, hitStrength, resultObj);
                }
            }
            
            $('.mean').html((resultObj.resultValue/runs).toFixed(2));
            $('.median').html(resultObj.hits.sort()[Math.floor(resultObj.hits.length/2)]);
            $('.missed').html(resultObj.missCount);
            $('.doubled').html(resultObj.multipleCount);
        });
    })();