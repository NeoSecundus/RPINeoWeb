'use strict';

function checkForEmojiClasses() {
    const emojiFields = document.getElementsByClassName("emoji-support");

    for (let i = 0; i < emojiFields.length; i++) {
        emojiFields[i].removeEventListener("keydown", checkEmojiInput);
        emojiFields[i].removeEventListener("keypress", addEmojiSearchText);

        emojiFields[i].addEventListener("keydown", checkEmojiInput);
        emojiFields[i].addEventListener("keypress", addEmojiSearchText);
    }
}

let checkEmojiString = false;
let emojiString = "";
function checkEmojiInput(keyEvent) {
    if (keyEvent.key === ":") {
        checkEmojiString = true;
        return;
    }

    if (keyEvent.key === " ") {
        checkEmojiString = false;
        emojiString = "";
        return;
    }

    if (checkEmojiString) {
        if (keyEvent.keyCode === 8) {
            emojiString = emojiString.substring(0, emojiString.length - 1);
        }

        if (keyEvent.keyCode === 13 || (keyEvent.keyCode >= 48 && keyEvent.keyCode <= 57)) {
            keyEvent.preventDefault();
            let offset = keyEvent.keyCode - 48;
            offset = offset < 0 ? 0 : offset;
            let emoji = getMatchedEmoji(offset);

            let field = keyEvent.target;
            insertText(field, emoji);
            emojiString = "";
            checkEmojiString = false;
        }
    }
}

function addEmojiSearchText(keyEvent) {
    if (checkEmojiString && keyEvent.key !== ":") {
        emojiString += keyEvent.key;
    }
}

function getMatchedEmoji(offset = 0) {
    let emojis = [];
    for (let i = 0; i < emojiTable.length; i++) {
        let tableSubStr = emojiTable[i][1].substring(0, emojiString.length).toLowerCase();
        if (tableSubStr === emojiString.toLowerCase()) {
            emojis.push(emojiTable[i][0]);
        }
    }
    return emojis[offset] || "?"
}

function insertText(field, val) {
    let curPos = field.selectionStart;
    field.innerHTML = field.value.substring(0, curPos - (emojiString.length + 1))
        + val
        + field.value.substring(curPos, field.value.length);
    field.value = field.innerHTML;

    field.selectionEnd = field.selectionStart = curPos - emojiString.length;
    //setCursorPos(field, curPos - emojiString.length - 1);
}

function setCursorPos(element, pos) {
    let range = document.createRange();
    let sel = window.getSelection();
    range.setStart(element.childNodes[0], pos+1);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
}


const emojiTable = [
["&#x1F47D", "alien"],
["&#x1F47E", "alien_monster"],
["&#x1F48B","kissmark"],
["&#x1F48C","loveletter"],
["&#x1F498","heartwitharrow"],
["&#x1F49D","heartwithribbon"],
["&#x1F496","sparklingheart"],
["&#x1F497","growingheart"],
["&#x1F493","beatingheart"],
["&#x1F49E","revolvinghearts"],
["&#x1F495","twohearts"],
["&#x1F49F","heartdecoration"],
["&#x2763","heartexclamation"],
["&#x1F494","brokenheart"],
["&#x2764&#xFE0F&#x200D&#x1F525","heartonfire"],
["&#x2764&#xFE0F&#x200D&#x1FA79","mendingheart"],
["&#x2764","redheart"],
["&#x1F9E1","orangeheart"],
["&#x1F49B","yellowheart"],
["&#x1F49A","greenheart"],
["&#x1F499","blueheart"],
["&#x1F49C","purpleheart"],
["&#x1F90E","brownheart"],
["&#x1F5A4","blackheart"],
["&#x1F90D","whiteheart"],
["&#x1F4AF","hundredpoints"],
["&#x1F4A2","angersymbol"],
["&#x1F4A5","collision"],
["&#x1F4AB","dizzy"],
["&#x1F4A6","sweatdroplets"],
["&#x1F4A8","dashingaway"],
["&#x1F573","hole"],
["&#x1F4A3","bomb"],
["&#x1F4AC","speechballoon"],
["&#x1F441&#xFE0F&#x200D&#x1F5E8&#xFE0F","eyeinspeechbubble"],
["&#x1F5E8","leftspeechbubble"],
["&#x1F5EF","rightangerbubble"],
["&#x1F4AD","thoughtballoon"],
["&#x1F4A4","zzz"],
["&#x1F44B","wavinghand"],
["&#x1F91A","raisedbackofhand"],
["&#x1F590","handwithfingerssplayed"],
["&#x270B","raisedhand"],
["&#x1F596","vulcansalute"],
["&#x1F44C","OKhand"],
["&#x1F90C","pinchedfingers"],
["&#x1F90F","pinchinghand"],
["&#x270C","victoryhand"],
["&#x1F91E","crossedfingers"],
["&#x1F91F","love-yougesture"],
["&#x1F918","signofthehorns"],
["&#x1F919","callmehand"],
["&#x1F448","backhandindexpointingleft"],
["&#x1F449","backhandindexpointingright"],
["&#x1F446","backhandindexpointingup"],
["&#x1F595","middlefinger"],
["&#x1F447","backhandindexpointingdown"],
["&#x261D","indexpointingup"],
["&#x1F44D","thumbsup"],
["&#x1F44E","thumbsdown"],
["&#x270A","raisedfist"],
["&#x1F44A","oncomingfist"],
["&#x1F91B","left-facingfist"],
["&#x1F91C","right-facingfist"],
["&#x1F44F","clappinghands"],
["&#x1F64C","raisinghands"],
["&#x1F450","openhands"],
["&#x1F932","palmsuptogether"],
["&#x1F91D","handshake"],
["&#x1F64F","foldedhands"],
["&#x270D","writinghand"],
["&#x1F485","nailpolish"],
["&#x1F933","selfie"],
["&#x1F4AA","flexedbiceps"],
["&#x1F9BE","mechanicalarm"],
["&#x1F9BF","mechanicalleg"],
["&#x1F9B5","leg"],
["&#x1F9B6","foot"],
["&#x1F442","ear"],
["&#x1F9BB","earwithhearingaid"],
["&#x1F443","nose"],
["&#x1F9E0","brain"],
["&#x1FAC0","anatomicalheart"],
["&#x1FAC1","lungs"],
["&#x1F9B7","tooth"],
["&#x1F9B4","bone"],
["&#x1F440","eyes"],
["&#x1F441","eye"],
["&#x1F445","tongue"],
["&#x1F444","mouth"],
["&#x1F93A","personfencing"],
["&#x1F3C7","horseracing"],
["&#x26F7","skier"],
["&#x1F3C2","snowboarder"],
["&#x1F3CC","persongolfing"],
["&#x1F3CC&#xFE0F&#x200D&#x2642&#xFE0F","mangolfing"],
["&#x1F3CC&#xFE0F&#x200D&#x2640&#xFE0F","womangolfing"],
["&#x1F3C4","personsurfing"],
["&#x1F3C4&#x200D&#x2642&#xFE0F","mansurfing"],
["&#x1F3C4&#x200D&#x2640&#xFE0F","womansurfing"],
["&#x1F6A3","personrowingboat"],
["&#x1F6A3&#x200D&#x2642&#xFE0F","manrowingboat"],
["&#x1F6A3&#x200D&#x2640&#xFE0F","womanrowingboat"],
["&#x1F3CA","personswimming"],
["&#x1F3CA&#x200D&#x2642&#xFE0F","manswimming"],
["&#x1F3CA&#x200D&#x2640&#xFE0F","womanswimming"],
["&#x26F9","personbouncingball"],
["&#x26F9&#xFE0F&#x200D&#x2642&#xFE0F","manbouncingball"],
["&#x26F9&#xFE0F&#x200D&#x2640&#xFE0F","womanbouncingball"],
["&#x1F3CB","personliftingweights"],
["&#x1F3CB&#xFE0F&#x200D&#x2642&#xFE0F","manliftingweights"],
["&#x1F3CB&#xFE0F&#x200D&#x2640&#xFE0F","womanliftingweights"],
["&#x1F6B4","personbiking"],
["&#x1F6B4&#x200D&#x2642&#xFE0F","manbiking"],
["&#x1F6B4&#x200D&#x2640&#xFE0F","womanbiking"],
["&#x1F6B5","personmountainbiking"],
["&#x1F6B5&#x200D&#x2642&#xFE0F","manmountainbiking"],
["&#x1F6B5&#x200D&#x2640&#xFE0F","womanmountainbiking"],
["&#x1F938","personcartwheeling"],
["&#x1F938&#x200D&#x2642&#xFE0F","mancartwheeling"],
["&#x1F938&#x200D&#x2640&#xFE0F","womancartwheeling"],
["&#x1F93C","peoplewrestling"],
["&#x1F93C&#x200D&#x2642&#xFE0F","menwrestling"],
["&#x1F93C&#x200D&#x2640&#xFE0F","womenwrestling"],
["&#x1F93D","personplayingwaterpolo"],
["&#x1F93D&#x200D&#x2642&#xFE0F","manplayingwaterpolo"],
["&#x1F93D&#x200D&#x2640&#xFE0F","womanplayingwaterpolo"],
["&#x1F93E","personplayinghandball"],
["&#x1F93E&#x200D&#x2642&#xFE0F","manplayinghandball"],
["&#x1F93E&#x200D&#x2640&#xFE0F","womanplayinghandball"],
["&#x1F939","personjuggling"],
["&#x1F939&#x200D&#x2642&#xFE0F","manjuggling"],
["&#x1F939&#x200D&#x2640&#xFE0F","womanjuggling"],
["&#x1F9D8","personinlotusposition"],
["&#x1F9D8&#x200D&#x2642&#xFE0F","maninlotusposition"],
["&#x1F9D8&#x200D&#x2640&#xFE0F","womaninlotusposition"],
["&#x1F6C0","persontakingbath"],
["&#x1F6CC","personinbed"],
["&#x1F9D1&#x200D&#x1F91D&#x200D&#x1F9D1","peopleholdinghands"],
["&#x1F46D","womenholdinghands"],
["&#x1F46B","womanandmanholdinghands"],
["&#x1F46C","menholdinghands"],
["&#x1F48F","kiss"],
["&#x1F469&#x200D&#x2764&#xFE0F&#x200D&#x1F48B&#x200D&#x1F468","kiss,woman,man"],
["&#x1F468&#x200D&#x2764&#xFE0F&#x200D&#x1F48B&#x200D&#x1F468","kiss,man,man"],
["&#x1F469&#x200D&#x2764&#xFE0F&#x200D&#x1F48B&#x200D&#x1F469","kiss,woman,woman"],
["&#x1F491","couplewithheart"],
["&#x1F469&#x200D&#x2764&#xFE0F&#x200D&#x1F468","couplewithheart,woman,man"],
["&#x1F468&#x200D&#x2764&#xFE0F&#x200D&#x1F468","couplewithheart,man,man"],
["&#x1F469&#x200D&#x2764&#xFE0F&#x200D&#x1F469","couplewithheart,woman,woman"],
["&#x1F46A","family"],
["&#x1F468&#x200D&#x1F469&#x200D&#x1F466","family,man,woman,boy"],
["&#x1F468&#x200D&#x1F469&#x200D&#x1F467","family,man,woman,girl"],
["&#x1F468&#x200D&#x1F469&#x200D&#x1F467&#x200D&#x1F466","family,man,woman,girl,boy"],
["&#x1F468&#x200D&#x1F469&#x200D&#x1F466&#x200D&#x1F466","family,man,woman,boy,boy"],
["&#x1F468&#x200D&#x1F469&#x200D&#x1F467&#x200D&#x1F467","family,man,woman,girl,girl"],
["&#x1F468&#x200D&#x1F468&#x200D&#x1F466","family,man,man,boy"],
["&#x1F468&#x200D&#x1F468&#x200D&#x1F467","family,man,man,girl"],
["&#x1F468&#x200D&#x1F468&#x200D&#x1F467&#x200D&#x1F466","family,man,man,girl,boy"],
["&#x1F468&#x200D&#x1F468&#x200D&#x1F466&#x200D&#x1F466","family,man,man,boy,boy"],
["&#x1F468&#x200D&#x1F468&#x200D&#x1F467&#x200D&#x1F467","family,man,man,girl,girl"],
["&#x1F469&#x200D&#x1F469&#x200D&#x1F466","family,woman,woman,boy"],
["&#x1F469&#x200D&#x1F469&#x200D&#x1F467","family,woman,woman,girl"],
["&#x1F469&#x200D&#x1F469&#x200D&#x1F467&#x200D&#x1F466","family,woman,woman,girl,boy"],
["&#x1F469&#x200D&#x1F469&#x200D&#x1F466&#x200D&#x1F466","family,woman,woman,boy,boy"],
["&#x1F469&#x200D&#x1F469&#x200D&#x1F467&#x200D&#x1F467","family,woman,woman,girl,girl"],
["&#x1F468&#x200D&#x1F466","family,man,boy"],
["&#x1F468&#x200D&#x1F466&#x200D&#x1F466","family,man,boy,boy"],
["&#x1F468&#x200D&#x1F467","family,man,girl"],
["&#x1F468&#x200D&#x1F467&#x200D&#x1F466","family,man,girl,boy"],
["&#x1F468&#x200D&#x1F467&#x200D&#x1F467","family,man,girl,girl"],
["&#x1F469&#x200D&#x1F466","family,woman,boy"],
["&#x1F469&#x200D&#x1F466&#x200D&#x1F466","family,woman,boy,boy"],
["&#x1F469&#x200D&#x1F467","family,woman,girl"],
["&#x1F469&#x200D&#x1F467&#x200D&#x1F466","family,woman,girl,boy"],
["&#x1F469&#x200D&#x1F467&#x200D&#x1F467","family,woman,girl,girl"],
["&#x1F5E3","speakinghead"],
["&#x1F464","bustinsilhouette"],
["&#x1F465","bustsinsilhouette"],
["&#x1FAC2","peoplehugging"],
["&#x1F463","footprints"],
["&#x1F9B0","redhair"],
["&#x1F9B1","curlyhair"],
["&#x1F9B3","whitehair"],
["&#x1F9B2","bald"],
["&#x1F435","monkeyface"],
["&#x1F412","monkey"],
["&#x1F98D","gorilla"],
["&#x1F9A7","orangutan"],
["&#x1F436","dogface"],
["&#x1F415","dog"],
["&#x1F9AE","guidedog"],
["&#x1F415&#x200D&#x1F9BA","servicedog"],
["&#x1F429","poodle"],
["&#x1F43A","wolf"],
["&#x1F98A","fox"],
["&#x1F99D","raccoon"],
["&#x1F431","catface"],
["&#x1F408","cat"],
["&#x1F408&#x200D&#x2B1B","blackcat"],
["&#x1F981","lion"],
["&#x1F42F","tigerface"],
["&#x1F405","tiger"],
["&#x1F406","leopard"],
["&#x1F434","horseface"],
["&#x1F40E","horse"],
["&#x1F984","unicorn"],
["&#x1F993","zebra"],
["&#x1F98C","deer"],
["&#x1F9AC","bison"],
["&#x1F42E","cowface"],
["&#x1F402","ox"],
["&#x1F403","waterbuffalo"],
["&#x1F404","cow"],
["&#x1F437","pigface"],
["&#x1F416","pig"],
["&#x1F417","boar"],
["&#x1F43D","pignose"],
["&#x1F40F","ram"],
["&#x1F411","ewe"],
["&#x1F410","goat"],
["&#x1F42A","camel"],
["&#x1F42B","two-humpcamel"],
["&#x1F999","llama"],
["&#x1F992","giraffe"],
["&#x1F418","elephant"],
["&#x1F9A3","mammoth"],
["&#x1F98F","rhinoceros"],
["&#x1F99B","hippopotamus"],
["&#x1F42D","mouseface"],
["&#x1F401","mouse"],
["&#x1F400","rat"],
["&#x1F439","hamster"],
["&#x1F430","rabbitface"],
["&#x1F407","rabbit"],
["&#x1F43F","chipmunk"],
["&#x1F9AB","beaver"],
["&#x1F994","hedgehog"],
["&#x1F987","bat"],
["&#x1F43B","bear"],
["&#x1F43B&#x200D&#x2744&#xFE0F","polarbear"],
["&#x1F428","koala"],
["&#x1F43C","panda"],
["&#x1F9A5","sloth"],
["&#x1F9A6","otter"],
["&#x1F9A8","skunk"],
["&#x1F998","kangaroo"],
["&#x1F9A1","badger"],
["&#x1F43E","pawprints"],
["&#x1F983","turkey"],
["&#x1F414","chicken"],
["&#x1F413","rooster"],
["&#x1F423","hatchingchick"],
["&#x1F424","babychick"],
["&#x1F425","front-facingbabychick"],
["&#x1F426","bird"],
["&#x1F427","penguin"],
["&#x1F54A","dove"],
["&#x1F985","eagle"],
["&#x1F986","duck"],
["&#x1F9A2","swan"],
["&#x1F989","owl"],
["&#x1F9A4","dodo"],
["&#x1FAB6","feather"],
["&#x1F9A9","flamingo"],
["&#x1F99A","peacock"],
["&#x1F99C","parrot"],
["&#x1F438","frog"],
["&#x1F40A","crocodile"],
["&#x1F422","turtle"],
["&#x1F98E","lizard"],
["&#x1F40D","snake"],
["&#x1F432","dragonface"],
["&#x1F409","dragon"],
["&#x1F995","sauropod"],
["&#x1F996","T-Rex"],
["&#x1F433","spoutingwhale"],
["&#x1F40B","whale"],
["&#x1F42C","dolphin"],
["&#x1F9AD","seal"],
["&#x1F41F","fish"],
["&#x1F420","tropicalfish"],
["&#x1F421","blowfish"],
["&#x1F988","shark"],
["&#x1F419","octopus"],
["&#x1F41A","spiralshell"],
["&#x1F40C","snail"],
["&#x1F98B","butterfly"],
["&#x1F41B","bug"],
["&#x1F41C","ant"],
["&#x1F41D","honeybee"],
["&#x1FAB2","beetle"],
["&#x1F41E","ladybeetle"],
["&#x1F997","cricket"],
["&#x1FAB3","cockroach"],
["&#x1F577","spider"],
["&#x1F578","spiderweb"],
["&#x1F982","scorpion"],
["&#x1F99F","mosquito"],
["&#x1FAB0","fly"],
["&#x1FAB1","worm"],
["&#x1F9A0","microbe"],
["&#x1F490","bouquet"],
["&#x1F338","cherryblossom"],
["&#x1F4AE","whiteflower"],
["&#x1F3F5","rosette"],
["&#x1F339","rose"],
["&#x1F940","wiltedflower"],
["&#x1F33A","hibiscus"],
["&#x1F33B","sunflower"],
["&#x1F33C","blossom"],
["&#x1F337","tulip"],
["&#x1F331","seedling"],
["&#x1FAB4","pottedplant"],
["&#x1F332","evergreentree"],
["&#x1F333","deciduoustree"],
["&#x1F334","palmtree"],
["&#x1F335","cactus"],
["&#x1F33E","sheafofrice"],
["&#x1F33F","herb"],
["&#x2618","shamrock"],
["&#x1F340","fourleafclover"],
["&#x1F341","mapleleaf"],
["&#x1F342","fallenleaf"],
["&#x1F343","leafflutteringinwind"],
["&#x1F347","grapes"],
["&#x1F348","melon"],
["&#x1F349","watermelon"],
["&#x1F34A","tangerine"],
["&#x1F34B","lemon"],
["&#x1F34C","banana"],
["&#x1F34D","pineapple"],
["&#x1F96D","mango"],
["&#x1F34E","redapple"],
["&#x1F34F","greenapple"],
["&#x1F350","pear"],
["&#x1F351","peach"],
["&#x1F352","cherries"],
["&#x1F353","strawberry"],
["&#x1FAD0","blueberries"],
["&#x1F95D","kiwifruit"],
["&#x1F345","tomato"],
["&#x1FAD2","olive"],
["&#x1F965","coconut"],
["&#x1F951","avocado"],
["&#x1F346","eggplant"],
["&#x1F954","potato"],
["&#x1F955","carrot"],
["&#x1F33D","earofcorn"],
["&#x1F336","hotpepper"],
["&#x1FAD1","bellpepper"],
["&#x1F952","cucumber"],
["&#x1F96C","leafygreen"],
["&#x1F966","broccoli"],
["&#x1F9C4","garlic"],
["&#x1F9C5","onion"],
["&#x1F344","mushroom"],
["&#x1F95C","peanuts"],
["&#x1F330","chestnut"],
["&#x1F35E","bread"],
["&#x1F950","croissant"],
["&#x1F956","baguettebread"],
["&#x1FAD3","flatbread"],
["&#x1F968","pretzel"],
["&#x1F96F","bagel"],
["&#x1F95E","pancakes"],
["&#x1F9C7","waffle"],
["&#x1F9C0","cheesewedge"],
["&#x1F356","meatonbone"],
["&#x1F357","poultryleg"],
["&#x1F969","cutofmeat"],
["&#x1F953","bacon"],
["&#x1F354","hamburger"],
["&#x1F35F","frenchfries"],
["&#x1F355","pizza"],
["&#x1F32D","hotdog"],
["&#x1F96A","sandwich"],
["&#x1F32E","taco"],
["&#x1F32F","burrito"],
["&#x1FAD4","tamale"],
["&#x1F959","stuffedflatbread"],
["&#x1F9C6","falafel"],
["&#x1F95A","egg"],
["&#x1F373","cooking"],
["&#x1F958","shallowpanoffood"],
["&#x1F372","potoffood"],
["&#x1FAD5","fondue"],
["&#x1F963","bowlwithspoon"],
["&#x1F957","greensalad"],
["&#x1F37F","popcorn"],
["&#x1F9C8","butter"],
["&#x1F9C2","salt"],
["&#x1F96B","cannedfood"],
["&#x1F371","bentobox"],
["&#x1F358","ricecracker"],
["&#x1F359","riceball"],
["&#x1F35A","cookedrice"],
["&#x1F35B","curryrice"],
["&#x1F35C","steamingbowl"],
["&#x1F35D","spaghetti"],
["&#x1F360","roastedsweetpotato"],
["&#x1F362","oden"],
["&#x1F363","sushi"],
["&#x1F364","friedshrimp"],
["&#x1F365","fishcakewithswirl"],
["&#x1F96E","mooncake"],
["&#x1F361","dango"],
["&#x1F95F","dumpling"],
["&#x1F960","fortunecookie"],
["&#x1F961","takeoutbox"],
["&#x1F980","crab"],
["&#x1F99E","lobster"],
["&#x1F990","shrimp"],
["&#x1F991","squid"],
["&#x1F9AA","oyster"],
["&#x1F366","softicecream"],
["&#x1F367","shavedice"],
["&#x1F368","icecream"],
["&#x1F369","doughnut"],
["&#x1F36A","cookie"],
["&#x1F382","birthdaycake"],
["&#x1F370","shortcake"],
["&#x1F9C1","cupcake"],
["&#x1F967","pie"],
["&#x1F36B","chocolatebar"],
["&#x1F36C","candy"],
["&#x1F36D","lollipop"],
["&#x1F36E","custard"],
["&#x1F36F","honeypot"],
["&#x1F37C","babybottle"],
["&#x1F95B","glassofmilk"],
["&#x2615","hotbeverage"],
["&#x1FAD6","teapot"],
["&#x1F375","teacupwithouthandle"],
["&#x1F376","sake"],
["&#x1F37E","bottlewithpoppingcork"],
["&#x1F377","wineglass"],
["&#x1F378","cocktailglass"],
["&#x1F379","tropicaldrink"],
["&#x1F37A","beermug"],
["&#x1F37B","clinkingbeermugs"],
["&#x1F942","clinkingglasses"],
["&#x1F943","tumblerglass"],
["&#x1F964","cupwithstraw"],
["&#x1F9CB","bubbletea"],
["&#x1F9C3","beveragebox"],
["&#x1F9C9","mate"],
["&#x1F9CA","ice"],
["&#x1F962","chopsticks"],
["&#x1F37D","forkandknifewithplate"],
["&#x1F374","forkandknife"],
["&#x1F944","spoon"],
["&#x1F52A","kitchenknife"],
["&#x1F3FA","amphora"],
["&#x1F30D","globeshowingEurope-Africa"],
["&#x1F30E","globeshowingAmericas"],
["&#x1F30F","globeshowingAsia-Australia"],
["&#x1F310","globewithmeridians"],
["&#x1F5FA","worldmap"],
["&#x1F5FE","mapofJapan"],
["&#x1F9ED","compass"],
["&#x1F3D4","snow-cappedmountain"],
["&#x26F0","mountain"],
["&#x1F30B","volcano"],
["&#x1F5FB","mountfuji"],
["&#x1F3D5","camping"],
["&#x1F3D6","beachwithumbrella"],
["&#x1F3DC","desert"],
["&#x1F3DD","desertisland"],
["&#x1F3DE","nationalpark"],
["&#x1F3DF","stadium"],
["&#x1F3DB","classicalbuilding"],
["&#x1F3D7","buildingconstruction"],
["&#x1F9F1","brick"],
["&#x1FAA8","rock"],
["&#x1FAB5","wood"],
["&#x1F6D6","hut"],
["&#x1F3D8","houses"],
["&#x1F3DA","derelicthouse"],
["&#x1F3E0","house"],
["&#x1F3E1","housewithgarden"],
["&#x1F3E2","officebuilding"],
["&#x1F3E3","Japanesepostoffice"],
["&#x1F3E4","postoffice"],
["&#x1F3E5","hospital"],
["&#x1F3E6","bank"],
["&#x1F3E8","hotel"],
["&#x1F3E9","lovehotel"],
["&#x1F3EA","conveniencestore"],
["&#x1F3EB","school"],
["&#x1F3EC","departmentstore"],
["&#x1F3ED","factory"],
["&#x1F3EF","Japanesecastle"],
["&#x1F3F0","castle"],
["&#x1F492","wedding"],
["&#x1F5FC","Tokyotower"],
["&#x1F5FD","StatueofLiberty"],
["&#x26EA","church"],
["&#x1F54C","mosque"],
["&#x1F6D5","hindutemple"],
["&#x1F54D","synagogue"],
["&#x26E9","shintoshrine"],
["&#x1F54B","kaaba"],
["&#x26F2","fountain"],
["&#x26FA","tent"],
["&#x1F301","foggy"],
["&#x1F303","nightwithstars"],
["&#x1F3D9","cityscape"],
["&#x1F304","sunriseovermountains"],
["&#x1F305","sunrise"],
["&#x1F306","cityscapeatdusk"],
["&#x1F307","sunset"],
["&#x1F309","bridgeatnight"],
["&#x2668","hotsprings"],
["&#x1F3A0","carouselhorse"],
["&#x1F3A1","ferriswheel"],
["&#x1F3A2","rollercoaster"],
["&#x1F488","barberpole"],
["&#x1F3AA","circustent"],
["&#x1F682","locomotive"],
["&#x1F683","railwaycar"],
["&#x1F684","high-speedtrain"],
["&#x1F685","bullettrain"],
["&#x1F686","train"],
["&#x1F687","metro"],
["&#x1F688","lightrail"],
["&#x1F689","station"],
["&#x1F68A","tram"],
["&#x1F69D","monorail"],
["&#x1F69E","mountainrailway"],
["&#x1F68B","tramcar"],
["&#x1F68C","bus"],
["&#x1F68D","oncomingbus"],
["&#x1F68E","trolleybus"],
["&#x1F690","minibus"],
["&#x1F691","ambulance"],
["&#x1F692","fireengine"],
["&#x1F693","policecar"],
["&#x1F694","oncomingpolicecar"],
["&#x1F695","taxi"],
["&#x1F696","oncomingtaxi"],
["&#x1F697","automobile"],
["&#x1F698","oncomingautomobile"],
["&#x1F699","sportutilityvehicle"],
["&#x1F6FB","pickuptruck"],
["&#x1F69A","deliverytruck"],
["&#x1F69B","articulatedlorry"],
["&#x1F69C","tractor"],
["&#x1F3CE","racingcar"],
["&#x1F3CD","motorcycle"],
["&#x1F6F5","motorscooter"],
["&#x1F9BD","manualwheelchair"],
["&#x1F9BC","motorizedwheelchair"],
["&#x1F6FA","autorickshaw"],
["&#x1F6B2","bicycle"],
["&#x1F6F4","kickscooter"],
["&#x1F6F9","skateboard"],
["&#x1F6FC","rollerskate"],
["&#x1F68F","busstop"],
["&#x1F6E3","motorway"],
["&#x1F6E4","railwaytrack"],
["&#x1F6E2","oildrum"],
["&#x26FD","fuelpump"],
["&#x1F6A8","policecarlight"],
["&#x1F6A5","horizontaltrafficlight"],
["&#x1F6A6","verticaltrafficlight"],
["&#x1F6D1","stopsign"],
["&#x1F6A7","construction"],
["&#x2693","anchor"],
["&#x26F5","sailboat"],
["&#x1F6F6","canoe"],
["&#x1F6A4","speedboat"],
["&#x1F6F3","passengership"],
["&#x26F4","ferry"],
["&#x1F6E5","motorboat"],
["&#x1F6A2","ship"],
["&#x2708","airplane"],
["&#x1F6E9","smallairplane"],
["&#x1F6EB","airplanedeparture"],
["&#x1F6EC","airplanearrival"],
["&#x1FA82","parachute"],
["&#x1F4BA","seat"],
["&#x1F681","helicopter"],
["&#x1F69F","suspensionrailway"],
["&#x1F6A0","mountaincableway"],
["&#x1F6A1","aerialtramway"],
["&#x1F6F0","satellite"],
["&#x1F680","rocket"],
["&#x1F6F8","flyingsaucer"],
["&#x1F6CE","bellhopbell"],
["&#x1F9F3","luggage"],
["&#x231B","hourglassdone"],
["&#x23F3","hourglassnotdone"],
["&#x231A","watch"],
["&#x23F0","alarmclock"],
["&#x23F1","stopwatch"],
["&#x23F2","timerclock"],
["&#x1F570","mantelpiececlock"],
["&#x1F55B","twelveo’clock"],
["&#x1F311","newmoon"],
["&#x1F312","waxingcrescentmoon"],
["&#x1F313","firstquartermoon"],
["&#x1F314","waxinggibbousmoon"],
["&#x1F315","fullmoon"],
["&#x1F316","waninggibbousmoon"],
["&#x1F317","lastquartermoon"],
["&#x1F318","waningcrescentmoon"],
["&#x1F319","crescentmoon"],
["&#x1F31A","newmoonface"],
["&#x1F31B","firstquartermoonface"],
["&#x1F31C","lastquartermoonface"],
["&#x1F321","thermometer"],
["&#x2600","sun"],
["&#x1F31D","fullmoonface"],
["&#x1F31E","sunwithface"],
["&#x1FA90","ringedplanet"],
["&#x2B50","star"],
["&#x1F31F","glowingstar"],
["&#x1F320","shootingstar"],
["&#x1F30C","milkyway"],
["&#x2601","cloud"],
["&#x26C5","sunbehindcloud"],
["&#x26C8","cloudwithlightningandrain"],
["&#x1F324","sunbehindsmallcloud"],
["&#x1F325","sunbehindlargecloud"],
["&#x1F326","sunbehindraincloud"],
["&#x1F327","cloudwithrain"],
["&#x1F328","cloudwithsnow"],
["&#x1F329","cloudwithlightning"],
["&#x1F32A","tornado"],
["&#x1F32B","fog"],
["&#x1F32C","windface"],
["&#x1F300","cyclone"],
["&#x1F308","rainbow"],
["&#x1F302","closedumbrella"],
["&#x2602","umbrella"],
["&#x2614","umbrellawithraindrops"],
["&#x26F1","umbrellaonground"],
["&#x26A1","highvoltage"],
["&#x2744","snowflake"],
["&#x2603","snowman"],
["&#x26C4","snowmanwithoutsnow"],
["&#x2604","comet"],
["&#x1F525","fire"],
["&#x1F4A7","droplet"],
["&#x1F30A","waterwave"],
["&#x1F383","jack-o-lantern"],
["&#x1F384","Christmastree"],
["&#x1F386","fireworks"],
["&#x1F387","sparkler"],
["&#x1F9E8","firecracker"],
["&#x2728","sparkles"],
["&#x1F388","balloon"],
["&#x1F389","partypopper"],
["&#x1F38A","confettiball"],
["&#x1F38B","tanabatatree"],
["&#x1F38D","pinedecoration"],
["&#x1F38E","Japanesedolls"],
["&#x1F38F","carpstreamer"],
["&#x1F390","windchime"],
["&#x1F391","moonviewingceremony"],
["&#x1F9E7","redenvelope"],
["&#x1F380","ribbon"],
["&#x1F381","wrappedgift"],
["&#x1F397","reminderribbon"],
["&#x1F39F","admissiontickets"],
["&#x1F3AB","ticket"],
["&#x1F396","militarymedal"],
["&#x1F3C6","trophy"],
["&#x1F3C5","sportsmedal"],
["&#x1F947","1stplacemedal"],
["&#x1F948","2ndplacemedal"],
["&#x1F949","3rdplacemedal"],
["&#x26BD","soccerball"],
["&#x26BE","baseball"],
["&#x1F94E","softball"],
["&#x1F3C0","basketball"],
["&#x1F3D0","volleyball"],
["&#x1F3C8","americanfootball"],
["&#x1F3C9","rugbyfootball"],
["&#x1F3BE","tennis"],
["&#x1F94F","flyingdisc"],
["&#x1F3B3","bowling"],
["&#x1F3CF","cricketgame"],
["&#x1F3D1","fieldhockey"],
["&#x1F3D2","icehockey"],
["&#x1F94D","lacrosse"],
["&#x1F3D3","pingpong"],
["&#x1F3F8","badminton"],
["&#x1F94A","boxingglove"],
["&#x1F94B","martialartsuniform"],
["&#x1F945","goalnet"],
["&#x26F3","flaginhole"],
["&#x26F8","iceskate"],
["&#x1F3A3","fishingpole"],
["&#x1F93F","divingmask"],
["&#x1F3BD","runningshirt"],
["&#x1F3BF","skis"],
["&#x1F6F7","sled"],
["&#x1F94C","curlingstone"],
["&#x1F3AF","bullseye"],
["&#x1FA80","yo-yo"],
["&#x1FA81","kite"],
["&#x1F3B1","pool8ball"],
["&#x1F52E","crystalball"],
["&#x1FA84","magicwand"],
["&#x1F9FF","nazaramulet"],
["&#x1F3AE","videogame"],
["&#x1F579","joystick"],
["&#x1F3B0","slotmachine"],
["&#x1F3B2","gamedie"],
["&#x1F9E9","puzzlepiece"],
["&#x1F9F8","teddybear"],
["&#x1FA85","piñata"],
["&#x1FA86","nestingdolls"],
["&#x2660","spadesuit"],
["&#x2665","heartsuit"],
["&#x2666","diamondsuit"],
["&#x2663","clubsuit"],
["&#x265F","chesspawn"],
["&#x1F0CF","joker"],
["&#x1F004","mahjongreddragon"],
["&#x1F3B4","flowerplayingcards"],
["&#x1F3AD","performingarts"],
["&#x1F5BC","framedpicture"],
["&#x1F3A8","artistpalette"],
["&#x1F9F5","thread"],
["&#x1FAA1","sewingneedle"],
["&#x1F9F6","yarn"],
["&#x1FAA2","knot"],
["&#x1F453","glasses"],
["&#x1F576","sunglasses"],
["&#x1F97D","goggles"],
["&#x1F97C","labcoat"],
["&#x1F9BA","safetyvest"],
["&#x1F454","necktie"],
["&#x1F455","t-shirt"],
["&#x1F456","jeans"],
["&#x1F9E3","scarf"],
["&#x1F9E4","gloves"],
["&#x1F9E5","coat"],
["&#x1F9E6","socks"],
["&#x1F457","dress"],
["&#x1F458","kimono"],
["&#x1F97B","sari"],
["&#x1FA71","one-pieceswimsuit"],
["&#x1FA72","briefs"],
["&#x1FA73","shorts"],
["&#x1F459","bikini"],
["&#x1F45A","woman’sclothes"],
["&#x1F45B","purse"],
["&#x1F45C","handbag"],
["&#x1F45D","clutchbag"],
["&#x1F6CD","shoppingbags"],
["&#x1F392","backpack"],
["&#x1FA74","thongsandal"],
["&#x1F45E","man’sshoe"],
["&#x1F45F","runningshoe"],
["&#x1F97E","hikingboot"],
["&#x1F97F","flatshoe"],
["&#x1F460","high-heeledshoe"],
["&#x1F461","woman’ssandal"],
["&#x1FA70","balletshoes"],
["&#x1F462","woman’sboot"],
["&#x1F451","crown"],
["&#x1F452","woman’shat"],
["&#x1F3A9","tophat"],
["&#x1F393","graduationcap"],
["&#x1F9E2","billedcap"],
["&#x1FA96","militaryhelmet"],
["&#x26D1","rescueworker’shelmet"],
["&#x1F4FF","prayerbeads"],
["&#x1F484","lipstick"],
["&#x1F48D","ring"],
["&#x1F48E","gemstone"],
["&#x1F507","mutedspeaker"],
["&#x1F508","speakerlowvolume"],
["&#x1F509","speakermediumvolume"],
["&#x1F50A","speakerhighvolume"],
["&#x1F4E2","loudspeaker"],
["&#x1F4E3","megaphone"],
["&#x1F4EF","postalhorn"],
["&#x1F514","bell"],
["&#x1F515","bellwithslash"],
["&#x1F3BC","musicalscore"],
["&#x1F3B5","musicalnote"],
["&#x1F3B6","musicalnotes"],
["&#x1F399","studiomicrophone"],
["&#x1F39A","levelslider"],
["&#x1F39B","controlknobs"],
["&#x1F3A4","microphone"],
["&#x1F3A7","headphone"],
["&#x1F4FB","radio"],
["&#x1F3B7","saxophone"],
["&#x1FA97","accordion"],
["&#x1F3B8","guitar"],
["&#x1F3B9","musicalkeyboard"],
["&#x1F3BA","trumpet"],
["&#x1F3BB","violin"],
["&#x1FA95","banjo"],
["&#x1F941","drum"],
["&#x1FA98","longdrum"],
["&#x1F4F1","mobilephone"],
["&#x1F4F2","mobilephonewitharrow"],
["&#x260E","telephone"],
["&#x1F4DE","telephonereceiver"],
["&#x1F4DF","pager"],
["&#x1F4E0","faxmachine"],
["&#x1F50B","battery"],
["&#x1F50C","electricplug"],
["&#x1F4BB","laptop"],
["&#x1F5A5","desktopcomputer"],
["&#x1F5A8","printer"],
["&#x2328","keyboard"],
["&#x1F5B1","computermouse"],
["&#x1F5B2","trackball"],
["&#x1F4BD","computerdisk"],
["&#x1F4BE","floppydisk"],
["&#x1F4BF","opticaldisk"],
["&#x1F4C0","dvd"],
["&#x1F9EE","abacus"],
["&#x1F3A5","moviecamera"],
["&#x1F39E","filmframes"],
["&#x1F4FD","filmprojector"],
["&#x1F3AC","clapperboard"],
["&#x1F4FA","television"],
["&#x1F4F7","camera"],
["&#x1F4F8","camerawithflash"],
["&#x1F4F9","videocamera"],
["&#x1F4FC","videocassette"],
["&#x1F50D","magnifyingglasstiltedleft"],
["&#x1F50E","magnifyingglasstiltedright"],
["&#x1F56F","candle"],
["&#x1F4A1","lightbulb"],
["&#x1F526","flashlight"],
["&#x1F3EE","redpaperlantern"],
["&#x1FA94","diyalamp"],
["&#x1F4D4","notebookwithdecorativecover"],
["&#x1F4D5","closedbook"],
["&#x1F4D6","openbook"],
["&#x1F4D7","greenbook"],
["&#x1F4D8","bluebook"],
["&#x1F4D9","orangebook"],
["&#x1F4DA","books"],
["&#x1F4D3","notebook"],
["&#x1F4D2","ledger"],
["&#x1F4C3","pagewithcurl"],
["&#x1F4DC","scroll"],
["&#x1F4C4","pagefacingup"],
["&#x1F4F0","newspaper"],
["&#x1F5DE","rolled-upnewspaper"],
["&#x1F4D1","bookmarktabs"],
["&#x1F516","bookmark"],
["&#x1F3F7","label"],
["&#x1F4B0","moneybag"],
["&#x1FA99","coin"],
["&#x1F4B4","yenbanknote"],
["&#x1F4B5","dollarbanknote"],
["&#x1F4B6","eurobanknote"],
["&#x1F4B7","poundbanknote"],
["&#x1F4B8","moneywithwings"],
["&#x1F4B3","creditcard"],
["&#x1F9FE","receipt"],
["&#x1F4B9","chartincreasingwithyen"],
["&#x2709","envelope"],
["&#x1F4E7","e-mail"],
["&#x1F4E8","incomingenvelope"],
["&#x1F4E9","envelopewitharrow"],
["&#x1F4E4","outboxtray"],
["&#x1F4E5","inboxtray"],
["&#x1F4E6","package"],
["&#x1F4EB","closedmailboxwithraisedflag"],
["&#x1F4EA","closedmailboxwithloweredflag"],
["&#x1F4EC","openmailboxwithraisedflag"],
["&#x1F4ED","openmailboxwithloweredflag"],
["&#x1F4EE","postbox"],
["&#x1F5F3","ballotboxwithballot"],
["&#x270F","pencil"],
["&#x2712","blacknib"],
["&#x1F58B","fountainpen"],
["&#x1F58A","pen"],
["&#x1F58C","paintbrush"],
["&#x1F58D","crayon"],
["&#x1F4DD","memo"],
["&#x1F4BC","briefcase"],
["&#x1F4C1","filefolder"],
["&#x1F4C2","openfilefolder"],
["&#x1F5C2","cardindexdividers"],
["&#x1F4C5","calendar"],
["&#x1F4C6","tear-offcalendar"],
["&#x1F5D2","spiralnotepad"],
["&#x1F5D3","spiralcalendar"],
["&#x1F4C7","cardindex"],
["&#x1F4C8","chartincreasing"],
["&#x1F4C9","chartdecreasing"],
["&#x1F4CA","barchart"],
["&#x1F4CB","clipboard"],
["&#x1F4CC","pushpin"],
["&#x1F4CD","roundpushpin"],
["&#x1F4CE","paperclip"],
["&#x1F587","linkedpaperclips"],
["&#x1F4CF","straightruler"],
["&#x1F4D0","triangularruler"],
["&#x2702","scissors"],
["&#x1F5C3","cardfilebox"],
["&#x1F5C4","filecabinet"],
["&#x1F5D1","wastebasket"],
["&#x1F512","locked"],
["&#x1F513","unlocked"],
["&#x1F50F","lockedwithpen"],
["&#x1F510","lockedwithkey"],
["&#x1F511","key"],
["&#x1F5DD","oldkey"],
["&#x1F528","hammer"],
["&#x1FA93","axe"],
["&#x26CF","pick"],
["&#x2692","hammerandpick"],
["&#x1F6E0","hammerandwrench"],
["&#x1F5E1","dagger"],
["&#x2694","crossedswords"],
["&#x1F52B","waterpistol"],
["&#x1FA83","boomerang"],
["&#x1F3F9","bowandarrow"],
["&#x1F6E1","shield"],
["&#x1FA9A","carpentrysaw"],
["&#x1F527","wrench"],
["&#x1FA9B","screwdriver"],
["&#x1F529","nutandbolt"],
["&#x2699","gear"],
["&#x1F5DC","clamp"],
["&#x2696","balancescale"],
["&#x1F9AF","whitecane"],
["&#x1F517","link"],
["&#x26D3","chains"],
["&#x1FA9D","hook"],
["&#x1F9F0","toolbox"],
["&#x1F9F2","magnet"],
["&#x1FA9C","ladder"],
["&#x2697","alembic"],
["&#x1F9EA","testtube"],
["&#x1F9EB","petridish"],
["&#x1F9EC","dna"],
["&#x1F52C","microscope"],
["&#x1F52D","telescope"],
["&#x1F4E1","satelliteantenna"],
["&#x1F489","syringe"],
["&#x1FA78","dropofblood"],
["&#x1F48A","pill"],
["&#x1FA79","adhesivebandage"],
["&#x1FA7A","stethoscope"],
["&#x1F6AA","door"],
["&#x1F6D7","elevator"],
["&#x1FA9E","mirror"],
["&#x1FA9F","window"],
["&#x1F6CF","bed"],
["&#x1F6CB","couchandlamp"],
["&#x1FA91","chair"],
["&#x1F6BD","toilet"],
["&#x1FAA0","plunger"],
["&#x1F6BF","shower"],
["&#x1F6C1","bathtub"],
["&#x1FAA4","mousetrap"],
["&#x1FA92","razor"],
["&#x1F9F4","lotionbottle"],
["&#x1F9F7","safetypin"],
["&#x1F9F9","broom"],
["&#x1F9FA","basket"],
["&#x1F9FB","rollofpaper"],
["&#x1FAA3","bucket"],
["&#x1F9FC","soap"],
["&#x1FAA5","toothbrush"],
["&#x1F9FD","sponge"],
["&#x1F9EF","fireextinguisher"],
["&#x1F6D2","shoppingcart"],
["&#x1F6AC","cigarette"],
["&#x26B0","coffin"],
["&#x1FAA6","headstone"],
["&#x26B1","funeralurn"],
["&#x1F5FF","moai"],
["&#x1FAA7","placard"],
["&#x1F3E7","ATMsign"],
["&#x1F6AE","litterinbinsign"],
["&#x1F6B0","potablewater"],
["&#x267F","wheelchairsymbol"],
["&#x1F6B9","men’sroom"],
["&#x1F6BA","women’sroom"],
["&#x1F6BB","restroom"],
["&#x1F6BC","babysymbol"],
["&#x1F6BE","watercloset"],
["&#x1F6C2","passportcontrol"],
["&#x1F6C3","customs"],
["&#x1F6C4","baggageclaim"],
["&#x1F6C5","leftluggage"],
["&#x26A0","warning"],
["&#x1F6B8","childrencrossing"],
["&#x26D4","noentry"],
["&#x1F6AB","prohibited"],
["&#x1F6B3","nobicycles"],
["&#x1F6AD","nosmoking"],
["&#x1F6AF","nolittering"],
["&#x1F6B1","non-potablewater"],
["&#x1F6B7","nopedestrians"],
["&#x1F4F5","nomobilephones"],
["&#x1F51E","nooneundereighteen"],
["&#x2622","radioactive"],
["&#x2623","biohazard"],
["&#x1F506","brightbutton"],
["&#x1F4F6","antennabars"],
["&#x1F4F3","vibrationmode"],
["&#x1F4F4","mobilephoneoff"],
["&#x2640","femalesign"],
["&#x2642","malesign"],
["&#x26A7","transgendersymbol"],
["&#x2716","multiply"],
["&#x2795","plus"],
["&#x2796","minus"],
["&#x2797","divide"],
["&#x267E","infinity"],
["&#x203C","doubleexclamationmark"],
["&#x2049","exclamationquestionmark"],
["&#x2753","redquestionmark"],
["&#x2754","whitequestionmark"],
["&#x2755","whiteexclamationmark"],
["&#x2757","redexclamationmark"],
["&#x3030","wavydash"],
["&#x1F4B1","currencyexchange"],
["&#x1F4B2","heavydollarsign"],
["&#x2695","medicalsymbol"],
["&#x267B","recyclingsymbol"],
["&#x269C","fleur-de-lis"],
["&#x1F531","tridentemblem"],
["&#x1F4DB","namebadge"],
["&#x1F530","Japanesesymbolforbeginner"],
["&#x2B55","hollowredcircle"],
["&#x2705","checkmarkbutton"],
["&#x2611","checkboxwithcheck"],
["&#x2714","checkmark"],
["&#x274C","crossmark"],
["&#x274E","crossmarkbutton"],
["&#x27B0","curlyloop"],
["&#x27BF","doublecurlyloop"],
["&#x303D","partalternationmark"],
["&#x2733","eight-spokedasterisk"],
["&#x2734","eight-pointedstar"],
["&#x2747","sparkle"],
["&#x00A9","copyright"],
["&#x00AE","registered"],
["&#x1F534","redcircle"],
["&#x1F7E0","orangecircle"],
["&#x1F7E1","yellowcircle"],
["&#x1F7E2","greencircle"],
["&#x1F535","bluecircle"],
["&#x1F7E3","purplecircle"],
["&#x1F7E4","browncircle"],
["&#x26AB","blackcircle"],
["&#x26AA","whitecircle"],
["&#x1F7E5","redsquare"],
["&#x1F7E7","orangesquare"],
["&#x1F7E8","yellowsquare"],
["&#x1F7E9","greensquare"],
["&#x1F7E6","bluesquare"],
["&#x1F7EA","purplesquare"],
["&#x1F7EB","brownsquare"],
["&#x2B1B","blacklargesquare"],
["&#x2B1C","whitelargesquare"],
["&#x25FC","blackmediumsquare"],
["&#x25FB","whitemediumsquare"],
["&#x25FE","blackmedium-smallsquare"],
["&#x25FD","whitemedium-smallsquare"],
["&#x25AA","blacksmallsquare"],
["&#x25AB","whitesmallsquare"],
["&#x1F536","largeorangediamond"],
["&#x1F537","largebluediamond"],
["&#x1F538","smallorangediamond"],
["&#x1F539","smallbluediamond"],
["&#x1F53A","redtrianglepointedup"],
["&#x1F53B","redtrianglepointeddown"],
["&#x1F4A0","diamondwithadot"],
["&#x1F518","radiobutton"],
["&#x1F533","whitesquarebutton"],
["&#x1F532","blacksquarebutton"],
["&#x1F3C1","chequeredflag"],
["&#x1F6A9","triangularflag"],
["&#x1F38C","crossedflags"],
["&#x1F3F4","blackflag"],
["&#x1F3F3","whiteflag"],
["&#x1F3F3&#xFE0F&#x200D&#x1F308","rainbowflag"],
["&#x1F3F3&#xFE0F&#x200D&#x26A7&#xFE0F","transgenderflag"],
["&#x1F3F4&#x200D&#x2620&#xFE0F","pirateflag"]
];
