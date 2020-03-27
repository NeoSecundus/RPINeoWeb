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
        for (let j = 0; j < emojiTable[i][1].length; j++) {
            let tableSubStr = emojiTable[i][1][j].substring(0, emojiString.length).toLowerCase();
            if (tableSubStr === emojiString.toLowerCase()) {
                emojis.push(emojiTable[i][0]);
                break;
            }
        }
    }
    return emojis[offset] || "?"
}

function insertText(field, val) {
    let curPos = getCursorPos(field);
    field.innerText = field.innerText.substring(0, curPos - (emojiString.length + 1))
        + val
        + field.innerText.substring(curPos, field.innerText.length);

    setCursorPos(field, curPos - emojiString.length - 1);
}

function setCursorPos(element, pos) {
    let range = document.createRange();
    let sel = window.getSelection();
    range.setStart(element.childNodes[0], pos+1);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
}

function getCursorPos(element) {
    let caretOffset = 0;
    let doc = element.ownerDocument || element.document;
    let win = doc.defaultView || doc.parentWindow;
    let sel;
    if (typeof win.getSelection != "undefined") {
        sel = win.getSelection();
        if (sel.rangeCount > 0) {
            let range = win.getSelection().getRangeAt(0);
            let preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(element);
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            caretOffset = preCaretRange.toString().length;
        }
    } else if ( (sel = doc.selection) && sel.type !== "Control") {
        let textRange = sel.createRange();
        let preCaretTextRange = doc.body.createTextRange();
        preCaretTextRange.moveToElementText(element);
        preCaretTextRange.setEndPoint("EndToEnd", textRange);
        caretOffset = preCaretTextRange.text.length;
    }
    return caretOffset;
}

const emojiTable = [
    ["\u00A9", ["copyright"]],
    ["\u00AE", ["registered"]],
    ["\u203C", ["bangbang"]],
    ["\u2049", ["interrobang"]],
    ["\u2122", ["tm"]],
    ["\u2139", ["information_source"]],
    ["\u2194", ["left_right_arrow"]],
    ["\u2195", ["arrow_up_down"]],
    ["\u2196", ["arrow_upper_left"]],
    ["\u2197", ["arrow_upper_right"]],
    ["\u2198", ["arrow_lower_right"]],
    ["\u2199", ["arrow_lower_left"]],
    ["\u21A9", ["leftwards_arrow_with_hook"]],
    ["\u21AA", ["arrow_right_hook"]],
    ["\u231A", ["watch"]],
    ["\u231B", ["hourglass"]],
    ["\u23E9", ["fast_forward"]],
    ["\u23EA", ["rewind"]],
    ["\u23EB", ["arrow_double_up"]],
    ["\u23EC", ["arrow_double_down"]],
    ["\u23F0", ["alarm_clock"]],
    ["\u23F3", ["hourglass_flowing_sand"]],
    ["\u24C2", ["m"]],
    ["\u25AA", ["black_small_square"]],
    ["\u25AB", ["white_small_square"]],
    ["\u25B6", ["arrow_forward"]],
    ["\u25C0", ["arrow_backward"]],
    ["\u25FB", ["white_medium_square"]],
    ["\u25FC", ["black_medium_square"]],
    ["\u25FD", ["white_medium_small_square"]],
    ["\u25FE", ["black_medium_small_square"]],
    ["\u2600", ["sunny"]],
    ["\u2601", ["cloud"]],
    ["\u260E", ["phone", "telephone"]],
    ["\u2611", ["ballot_box_with_check"]],
    ["\u2614", ["umbrella"]],
    ["\u2615", ["coffee"]],
    ["\u261D", ["point_up"]],
    ["\u263A", ["relaxed"]],
    ["\u2648", ["aries"]],
    ["\u2649", ["taurus"]],
    ["\u264A", ["gemini"]],
    ["\u264B", ["cancer"]],
    ["\u264C", ["leo"]],
    ["\u264D", ["virgo"]],
    ["\u264E", ["libra"]],
    ["\u264F", ["scorpius"]],
    ["\u2650", ["sagittarius"]],
    ["\u2651", ["capricorn"]],
    ["\u2652", ["aquarius"]],
    ["\u2653", ["pisces"]],
    ["\u2660", ["spades"]],
    ["\u2663", ["clubs"]],
    ["\u2665", ["hearts"]],
    ["\u2666", ["diamonds"]],
    ["\u2668", ["hotsprings"]],
    ["\u267B", ["recycle"]],
    ["\u267F", ["wheelchair"]],
    ["\u2693", ["anchor"]],
    ["\u26A0", ["warning"]],
    ["\u26A1", ["zap"]],
    ["\u26AA", ["white_circle"]],
    ["\u26AB", ["black_circle"]],
    ["\u26BD", ["soccer"]],
    ["\u26BE", ["baseball"]],
    ["\u26C4", ["snowman"]],
    ["\u26C5", ["partly_sunny"]],
    ["\u26CE", ["ophiuchus"]],
    ["\u26D4", ["no_entry"]],
    ["\u26EA", ["church"]],
    ["\u26F2", ["fountain"]],
    ["\u26F3", ["golf"]],
    ["\u26F5", ["boat", "sailboat"]],
    ["\u26FA", ["tent"]],
    ["\u26FD", ["fuelpump"]],
    ["\u2702", ["scissors"]],
    ["\u2705", ["white_check_mark"]],
    ["\u2708", ["airplane"]],
    ["\u2709", ["email", "envelope"]],
    ["\u270A", ["fist"]],
    ["\u270B", ["hand", "raised_hand"]],
    ["\u270C", ["v"]],
    ["\u270F", ["pencil2"]],
    ["\u2712", ["black_nib"]],
    ["\u2714", ["heavy_check_mark"]],
    ["\u2716", ["heavy_multiplication_x"]],
    ["\u2728", ["sparkles"]],
    ["\u2733", ["eight_spoked_asterisk"]],
    ["\u2734", ["eight_pointed_black_star"]],
    ["\u2744", ["snowflake"]],
    ["\u2747", ["sparkle"]],
    ["\u274C", ["x"]],
    ["\u274E", ["negative_squared_cross_mark"]],
    ["\u2753", ["question"]],
    ["\u2754", ["grey_question"]],
    ["\u2755", ["grey_exclamation"]],
    ["\u2757", ["exclamation", "heavy_exclamation_mark"]],
    ["\u2764", ["heart", "<3"]],
    ["\u2795", ["heavy_plus_sign"]],
    ["\u2796", ["heavy_minus_sign"]],
    ["\u2797", ["heavy_division_sign"]],
    ["\u27A1", ["arrow_right"]],
    ["\u27B0", ["curly_loop"]],
    ["\u27BF", ["loop"]],
    ["\u2934", ["arrow_heading_up"]],
    ["\u2935", ["arrow_heading_down"]],
    ["\u2B05", ["arrow_left"]],
    ["\u2B06", ["arrow_up"]],
    ["\u2B07", ["arrow_down"]],
    ["\u2B1B", ["black_large_square"]],
    ["\u2B1C", ["white_large_square"]],
    ["\u2B50", ["star"]],
    ["\u2B55", ["o"]],
    ["\u3030", ["wavy_dash"]],
    ["\u303D", ["part_alternation_mark"]],
    ["\u3297", ["congratulations"]],
    ["\u3299", ["secret"]],
    ["\uD83C\uDC04", ["mahjong"]],
    ["\uD83C\uDCCF", ["black_joker"]],
    ["\uD83C\uDD70", ["a"]],
    ["\uD83C\uDD71", ["b"]],
    ["\uD83C\uDD7E", ["o2"]],
    ["\uD83C\uDD7F", ["parking"]],
    ["\uD83C\uDD8E", ["ab"]],
    ["\uD83C\uDD91", ["cl"]],
    ["\uD83C\uDD92", ["cool"]],
    ["\uD83C\uDD93", ["free"]],
    ["\uD83C\uDD94", ["id"]],
    ["\uD83C\uDD95", ["new"]],
    ["\uD83C\uDD96", ["ng"]],
    ["\uD83C\uDD97", ["ok"]],
    ["\uD83C\uDD98", ["sos"]],
    ["\uD83C\uDD99", ["up"]],
    ["\uD83C\uDD9A", ["vs"]],
    ["\uD83C\uDE01", ["koko"]],
    ["\uD83C\uDE02", ["sa"]],
    ["\uD83C\uDE1A", ["u7121"]],
    ["\uD83C\uDE2F", ["u6307"]],
    ["\uD83C\uDE32", ["u7981"]],
    ["\uD83C\uDE33", ["u7a7a"]],
    ["\uD83C\uDE34", ["u5408"]],
    ["\uD83C\uDE35", ["u6e80"]],
    ["\uD83C\uDE36", ["u6709"]],
    ["\uD83C\uDE37", ["u6708"]],
    ["\uD83C\uDE38", ["u7533"]],
    ["\uD83C\uDE39", ["u5272"]],
    ["\uD83C\uDE3A", ["u55b6"]],
    ["\uD83C\uDE50", ["ideograph_advantage"]],
    ["\uD83C\uDE51", ["accept"]],
    ["\uD83C\uDF00", ["cyclone"]],
    ["\uD83C\uDF01", ["foggy"]],
    ["\uD83C\uDF02", ["closed_umbrella"]],
    ["\uD83C\uDF03", ["night_with_stars"]],
    ["\uD83C\uDF04", ["sunrise_over_mountains"]],
    ["\uD83C\uDF05", ["sunrise"]],
    ["\uD83C\uDF06", ["city_sunset"]],
    ["\uD83C\uDF07", ["city_sunrise"]],
    ["\uD83C\uDF08", ["rainbow"]],
    ["\uD83C\uDF09", ["bridge_at_night"]],
    ["\uD83C\uDF0A", ["ocean"]],
    ["\uD83C\uDF0B", ["volcano"]],
    ["\uD83C\uDF0C", ["milky_way"]],
    ["\uD83C\uDF0D", ["earth_africa"]],
    ["\uD83C\uDF0E", ["earth_americas"]],
    ["\uD83C\uDF0F", ["earth_asia"]],
    ["\uD83C\uDF10", ["globe_with_meridians"]],
    ["\uD83C\uDF11", ["new_moon"]],
    ["\uD83C\uDF12", ["waxing_crescent_moon"]],
    ["\uD83C\uDF13", ["first_quarter_moon"]],
    ["\uD83C\uDF14", ["moon", "waxing_gibbous_moon"]],
    ["\uD83C\uDF15", ["full_moon"]],
    ["\uD83C\uDF16", ["waning_gibbous_moon"]],
    ["\uD83C\uDF17", ["last_quarter_moon"]],
    ["\uD83C\uDF18", ["waning_crescent_moon"]],
    ["\uD83C\uDF19", ["crescent_moon"]],
    ["\uD83C\uDF20", ["stars"]],
    ["\uD83C\uDF1A", ["new_moon_with_face"]],
    ["\uD83C\uDF1B", ["first_quarter_moon_with_face"]],
    ["\uD83C\uDF1C", ["last_quarter_moon_with_face"]],
    ["\uD83C\uDF1D", ["full_moon_with_face"]],
    ["\uD83C\uDF1E", ["sun_with_face"]],
    ["\uD83C\uDF1F", ["star2"]],
    ["\uD83C\uDF30", ["chestnut"]],
    ["\uD83C\uDF31", ["seedling"]],
    ["\uD83C\uDF32", ["evergreen_tree"]],
    ["\uD83C\uDF33", ["deciduous_tree"]],
    ["\uD83C\uDF34", ["palm_tree"]],
    ["\uD83C\uDF35", ["cactus"]],
    ["\uD83C\uDF37", ["tulip"]],
    ["\uD83C\uDF38", ["cherry_blossom"]],
    ["\uD83C\uDF39", ["rose"]],
    ["\uD83C\uDF3A", ["hibiscus"]],
    ["\uD83C\uDF3B", ["sunflower"]],
    ["\uD83C\uDF3C", ["blossom"]],
    ["\uD83C\uDF3D", ["corn"]],
    ["\uD83C\uDF3E", ["ear_of_rice"]],
    ["\uD83C\uDF3F", ["herb"]],
    ["\uD83C\uDF40", ["four_leaf_clover"]],
    ["\uD83C\uDF41", ["maple_leaf"]],
    ["\uD83C\uDF42", ["fallen_leaf"]],
    ["\uD83C\uDF43", ["leaves"]],
    ["\uD83C\uDF44", ["mushroom"]],
    ["\uD83C\uDF45", ["tomato"]],
    ["\uD83C\uDF46", ["eggplant"]],
    ["\uD83C\uDF47", ["grapes"]],
    ["\uD83C\uDF48", ["melon"]],
    ["\uD83C\uDF49", ["watermelon"]],
    ["\uD83C\uDF4A", ["tangerine"]],
    ["\uD83C\uDF4B", ["lemon"]],
    ["\uD83C\uDF4C", ["banana"]],
    ["\uD83C\uDF4D", ["pineapple"]],
    ["\uD83C\uDF4E", ["apple"]],
    ["\uD83C\uDF4F", ["green_apple"]],
    ["\uD83C\uDF50", ["pear"]],
    ["\uD83C\uDF51", ["peach"]],
    ["\uD83C\uDF52", ["cherries"]],
    ["\uD83C\uDF53", ["strawberry"]],
    ["\uD83C\uDF54", ["hamburger"]],
    ["\uD83C\uDF55", ["pizza"]],
    ["\uD83C\uDF56", ["meat_on_bone"]],
    ["\uD83C\uDF57", ["poultry_leg"]],
    ["\uD83C\uDF58", ["rice_cracker"]],
    ["\uD83C\uDF59", ["rice_ball"]],
    ["\uD83C\uDF5A", ["rice"]],
    ["\uD83C\uDF5B", ["curry"]],
    ["\uD83C\uDF5C", ["ramen"]],
    ["\uD83C\uDF5D", ["spaghetti"]],
    ["\uD83C\uDF5E", ["bread"]],
    ["\uD83C\uDF5F", ["fries"]],
    ["\uD83C\uDF60", ["sweet_potato"]],
    ["\uD83C\uDF61", ["dango"]],
    ["\uD83C\uDF62", ["oden"]],
    ["\uD83C\uDF63", ["sushi"]],
    ["\uD83C\uDF64", ["fried_shrimp"]],
    ["\uD83C\uDF65", ["fish_cake"]],
    ["\uD83C\uDF66", ["icecream"]],
    ["\uD83C\uDF67", ["shaved_ice"]],
    ["\uD83C\uDF68", ["ice_cream"]],
    ["\uD83C\uDF69", ["doughnut"]],
    ["\uD83C\uDF6A", ["cookie"]],
    ["\uD83C\uDF6B", ["chocolate_bar"]],
    ["\uD83C\uDF6C", ["candy"]],
    ["\uD83C\uDF6D", ["lollipop"]],
    ["\uD83C\uDF6E", ["custard"]],
    ["\uD83C\uDF6F", ["honey_pot"]],
    ["\uD83C\uDF70", ["cake"]],
    ["\uD83C\uDF71", ["bento"]],
    ["\uD83C\uDF72", ["stew"]],
    ["\uD83C\uDF73", ["egg"]],
    ["\uD83C\uDF74", ["fork_and_knife"]],
    ["\uD83C\uDF75", ["tea"]],
    ["\uD83C\uDF76", ["sake"]],
    ["\uD83C\uDF77", ["wine_glass"]],
    ["\uD83C\uDF78", ["cocktail"]],
    ["\uD83C\uDF79", ["tropical_drink"]],
    ["\uD83C\uDF7A", ["beer"]],
    ["\uD83C\uDF7B", ["beers"]],
    ["\uD83C\uDF7C", ["baby_bottle"]],
    ["\uD83C\uDF80", ["ribbon"]],
    ["\uD83C\uDF81", ["gift"]],
    ["\uD83C\uDF82", ["birthday"]],
    ["\uD83C\uDF83", ["jack_o_lantern"]],
    ["\uD83C\uDF84", ["christmas_tree"]],
    ["\uD83C\uDF85", ["santa"]],
    ["\uD83C\uDF86", ["fireworks"]],
    ["\uD83C\uDF87", ["sparkler"]],
    ["\uD83C\uDF88", ["balloon"]],
    ["\uD83C\uDF89", ["tada"]],
    ["\uD83C\uDF8A", ["confetti_ball"]],
    ["\uD83C\uDF8B", ["tanabata_tree"]],
    ["\uD83C\uDF8C", ["crossed_flags"]],
    ["\uD83C\uDF8D", ["bamboo"]],
    ["\uD83C\uDF8E", ["dolls"]],
    ["\uD83C\uDF8F", ["flags"]],
    ["\uD83C\uDF90", ["wind_chime"]],
    ["\uD83C\uDF91", ["rice_scene"]],
    ["\uD83C\uDF92", ["school_satchel"]],
    ["\uD83C\uDF93", ["mortar_board"]],
    ["\uD83C\uDFA0", ["carousel_horse"]],
    ["\uD83C\uDFA1", ["ferris_wheel"]],
    ["\uD83C\uDFA2", ["roller_coaster"]],
    ["\uD83C\uDFA3", ["fishing_pole_and_fish"]],
    ["\uD83C\uDFA4", ["microphone"]],
    ["\uD83C\uDFA5", ["movie_camera"]],
    ["\uD83C\uDFA6", ["cinema"]],
    ["\uD83C\uDFA7", ["headphones"]],
    ["\uD83C\uDFA8", ["art"]],
    ["\uD83C\uDFA9", ["tophat"]],
    ["\uD83C\uDFAA", ["circus_tent"]],
    ["\uD83C\uDFAB", ["ticket"]],
    ["\uD83C\uDFAC", ["clapper"]],
    ["\uD83C\uDFAD", ["performing_arts"]],
    ["\uD83C\uDFAE", ["video_game"]],
    ["\uD83C\uDFAF", ["dart"]],
    ["\uD83C\uDFB0", ["slot_machine"]],
    ["\uD83C\uDFB1", ["8ball"]],
    ["\uD83C\uDFB2", ["game_die"]],
    ["\uD83C\uDFB3", ["bowling"]],
    ["\uD83C\uDFB4", ["flower_playing_cards"]],
    ["\uD83C\uDFB5", ["musical_note"]],
    ["\uD83C\uDFB6", ["notes"]],
    ["\uD83C\uDFB7", ["saxophone"]],
    ["\uD83C\uDFB8", ["guitar"]],
    ["\uD83C\uDFB9", ["musical_keyboard"]],
    ["\uD83C\uDFBA", ["trumpet"]],
    ["\uD83C\uDFBB", ["violin"]],
    ["\uD83C\uDFBC", ["musical_score"]],
    ["\uD83C\uDFBD", ["running_shirt_with_sash"]],
    ["\uD83C\uDFBE", ["tennis"]],
    ["\uD83C\uDFBF", ["ski"]],
    ["\uD83C\uDFC0", ["basketball"]],
    ["\uD83C\uDFC1", ["checkered_flag"]],
    ["\uD83C\uDFC2", ["snowboarder"]],
    ["\uD83C\uDFC3", ["runner", "running"]],
    ["\uD83C\uDFC4", ["surfer"]],
    ["\uD83C\uDFC6", ["trophy"]],
    ["\uD83C\uDFC7", ["horse_racing"]],
    ["\uD83C\uDFC8", ["football"]],
    ["\uD83C\uDFC9", ["rugby_football"]],
    ["\uD83C\uDFCA", ["swimmer"]],
    ["\uD83C\uDFE0", ["house"]],
    ["\uD83C\uDFE1", ["house_with_garden"]],
    ["\uD83C\uDFE2", ["office"]],
    ["\uD83C\uDFE3", ["post_office"]],
    ["\uD83C\uDFE4", ["european_post_office"]],
    ["\uD83C\uDFE5", ["hospital"]],
    ["\uD83C\uDFE6", ["bank"]],
    ["\uD83C\uDFE7", ["atm"]],
    ["\uD83C\uDFE8", ["hotel"]],
    ["\uD83C\uDFE9", ["love_hotel"]],
    ["\uD83C\uDFEA", ["convenience_store"]],
    ["\uD83C\uDFEB", ["school"]],
    ["\uD83C\uDFEC", ["department_store"]],
    ["\uD83C\uDFED", ["factory"]],
    ["\uD83C\uDFEE", ["izakaya_lantern", "lantern"]],
    ["\uD83C\uDFEF", ["japanese_castle"]],
    ["\uD83C\uDFF0", ["european_castle"]],
    ["\uD83D\uDC00", ["rat"]],
    ["\uD83D\uDC01", ["mouse2"]],
    ["\uD83D\uDC02", ["ox"]],
    ["\uD83D\uDC03", ["water_buffalo"]],
    ["\uD83D\uDC04", ["cow2"]],
    ["\uD83D\uDC05", ["tiger2"]],
    ["\uD83D\uDC06", ["leopard"]],
    ["\uD83D\uDC07", ["rabbit2"]],
    ["\uD83D\uDC08", ["cat2"]],
    ["\uD83D\uDC09", ["dragon"]],
    ["\uD83D\uDC0A", ["crocodile"]],
    ["\uD83D\uDC0B", ["whale2"]],
    ["\uD83D\uDC0C", ["snail"]],
    ["\uD83D\uDC0D", ["snake"]],
    ["\uD83D\uDC0E", ["racehorse"]],
    ["\uD83D\uDC0F", ["ram"]],
    ["\uD83D\uDC10", ["goat"]],
    ["\uD83D\uDC11", ["sheep"]],
    ["\uD83D\uDC12", ["monkey"]],
    ["\uD83D\uDC13", ["rooster"]],
    ["\uD83D\uDC14", ["chicken"]],
    ["\uD83D\uDC15", ["dog2"]],
    ["\uD83D\uDC16", ["pig2"]],
    ["\uD83D\uDC17", ["boar"]],
    ["\uD83D\uDC18", ["elephant"]],
    ["\uD83D\uDC19", ["octopus"]],
    ["\uD83D\uDC1A", ["shell"]],
    ["\uD83D\uDC1B", ["bug"]],
    ["\uD83D\uDC1C", ["ant"]],
    ["\uD83D\uDC1D", ["bee", "honeybee"]],
    ["\uD83D\uDC1E", ["beetle"]],
    ["\uD83D\uDC1F", ["fish"]],
    ["\uD83D\uDC20", ["tropical_fish"]],
    ["\uD83D\uDC21", ["blowfish"]],
    ["\uD83D\uDC22", ["turtle"]],
    ["\uD83D\uDC23", ["hatching_chick"]],
    ["\uD83D\uDC24", ["baby_chick"]],
    ["\uD83D\uDC25", ["hatched_chick"]],
    ["\uD83D\uDC26", ["bird"]],
    ["\uD83D\uDC27", ["penguin"]],
    ["\uD83D\uDC28", ["koala"]],
    ["\uD83D\uDC29", ["poodle"]],
    ["\uD83D\uDC2A", ["dromedary_camel"]],
    ["\uD83D\uDC2B", ["camel"]],
    ["\uD83D\uDC2C", ["dolphin", "flipper"]],
    ["\uD83D\uDC2D", ["mouse"]],
    ["\uD83D\uDC2E", ["cow"]],
    ["\uD83D\uDC2F", ["tiger"]],
    ["\uD83D\uDC30", ["rabbit"]],
    ["\uD83D\uDC31", ["cat"]],
    ["\uD83D\uDC32", ["dragon_face"]],
    ["\uD83D\uDC33", ["whale"]],
    ["\uD83D\uDC34", ["horse"]],
    ["\uD83D\uDC35", ["monkey_face"]],
    ["\uD83D\uDC36", ["dog"]],
    ["\uD83D\uDC37", ["pig"]],
    ["\uD83D\uDC38", ["frog"]],
    ["\uD83D\uDC39", ["hamster"]],
    ["\uD83D\uDC3A", ["wolf"]],
    ["\uD83D\uDC3B", ["bear"]],
    ["\uD83D\uDC3C", ["panda_face"]],
    ["\uD83D\uDC3D", ["pig_nose"]],
    ["\uD83D\uDC3E", ["feet", "paw_prints"]],
    ["\uD83D\uDC40", ["eyes"]],
    ["\uD83D\uDC42", ["ear"]],
    ["\uD83D\uDC43", ["nose"]],
    ["\uD83D\uDC44", ["lips"]],
    ["\uD83D\uDC45", ["tongue"]],
    ["\uD83D\uDC46", ["point_up_2"]],
    ["\uD83D\uDC47", ["point_down"]],
    ["\uD83D\uDC48", ["point_left"]],
    ["\uD83D\uDC49", ["point_right"]],
    ["\uD83D\uDC4A", ["facepunch", "punch"]],
    ["\uD83D\uDC4B", ["wave"]],
    ["\uD83D\uDC4C", ["ok_hand"]],
    ["\uD83D\uDC4D", ["+1", "thumbsup"]],
    ["\uD83D\uDC4E", ["-1", "thumbsdown"]],
    ["\uD83D\uDC4F", ["clap"]],
    ["\uD83D\uDC50", ["open_hands"]],
    ["\uD83D\uDC51", ["crown"]],
    ["\uD83D\uDC52", ["womans_hat"]],
    ["\uD83D\uDC53", ["eyeglasses"]],
    ["\uD83D\uDC54", ["necktie"]],
    ["\uD83D\uDC55", ["shirt", "tshirt"]],
    ["\uD83D\uDC56", ["jeans"]],
    ["\uD83D\uDC57", ["dress"]],
    ["\uD83D\uDC58", ["kimono"]],
    ["\uD83D\uDC59", ["bikini"]],
    ["\uD83D\uDC5A", ["womans_clothes"]],
    ["\uD83D\uDC5B", ["purse"]],
    ["\uD83D\uDC5C", ["handbag"]],
    ["\uD83D\uDC5D", ["pouch"]],
    ["\uD83D\uDC5E", ["mans_shoe", "shoe"]],
    ["\uD83D\uDC5F", ["athletic_shoe"]],
    ["\uD83D\uDC60", ["high_heel"]],
    ["\uD83D\uDC61", ["sandal"]],
    ["\uD83D\uDC62", ["boot"]],
    ["\uD83D\uDC63", ["footprints"]],
    ["\uD83D\uDC64", ["bust_in_silhouette"]],
    ["\uD83D\uDC65", ["busts_in_silhouette"]],
    ["\uD83D\uDC66", ["boy"]],
    ["\uD83D\uDC67", ["girl"]],
    ["\uD83D\uDC68", ["man"]],
    ["\uD83D\uDC69", ["woman"]],
    ["\uD83D\uDC6A", ["family"]],
    ["\uD83D\uDC6B", ["couple"]],
    ["\uD83D\uDC6C", ["two_men_holding_hands"]],
    ["\uD83D\uDC6D", ["two_women_holding_hands"]],
    ["\uD83D\uDC6E", ["cop"]],
    ["\uD83D\uDC6F", ["dancers"]],
    ["\uD83D\uDC70", ["bride_with_veil"]],
    ["\uD83D\uDC71", ["person_with_blond_hair"]],
    ["\uD83D\uDC72", ["man_with_gua_pi_mao"]],
    ["\uD83D\uDC73", ["man_with_turban"]],
    ["\uD83D\uDC74", ["older_man"]],
    ["\uD83D\uDC75", ["older_woman"]],
    ["\uD83D\uDC76", ["baby"]],
    ["\uD83D\uDC77", ["construction_worker"]],
    ["\uD83D\uDC78", ["princess"]],
    ["\uD83D\uDC79", ["japanese_ogre"]],
    ["\uD83D\uDC7A", ["japanese_goblin"]],
    ["\uD83D\uDC7B", ["ghost"]],
    ["\uD83D\uDC7C", ["angel"]],
    ["\uD83D\uDC7D", ["alien"]],
    ["\uD83D\uDC7E", ["space_invader"]],
    ["\uD83D\uDC7F", ["imp"]],
    ["\uD83D\uDC80", ["skull"]],
    ["\uD83D\uDC81", ["information_desk_person"]],
    ["\uD83D\uDC82", ["guardsman"]],
    ["\uD83D\uDC83", ["dancer"]],
    ["\uD83D\uDC84", ["lipstick"]],
    ["\uD83D\uDC85", ["nail_care"]],
    ["\uD83D\uDC86", ["massage"]],
    ["\uD83D\uDC87", ["haircut"]],
    ["\uD83D\uDC88", ["barber"]],
    ["\uD83D\uDC89", ["syringe"]],
    ["\uD83D\uDC8A", ["pill"]],
    ["\uD83D\uDC8B", ["kiss"]],
    ["\uD83D\uDC8C", ["love_letter"]],
    ["\uD83D\uDC8D", ["ring"]],
    ["\uD83D\uDC8E", ["gem"]],
    ["\uD83D\uDC8F", ["couplekiss"]],
    ["\uD83D\uDC90", ["bouquet"]],
    ["\uD83D\uDC91", ["couple_with_heart"]],
    ["\uD83D\uDC92", ["wedding"]],
    ["\uD83D\uDC93", ["heartbeat"]],
    ["\uD83D\uDC94", ["broken_heart", "<\/3"]],
    ["\uD83D\uDC95", ["two_hearts"]],
    ["\uD83D\uDC96", ["sparkling_heart"]],
    ["\uD83D\uDC97", ["heartpulse"]],
    ["\uD83D\uDC98", ["cupid"]],
    ["\uD83D\uDC99", ["blue_heart", "<3"]],
    ["\uD83D\uDC9A", ["green_heart", "<3"]],
    ["\uD83D\uDC9B", ["yellow_heart", "<3"]],
    ["\uD83D\uDC9C", ["purple_heart", "<3"]],
    ["\uD83D\uDC9D", ["gift_heart"]],
    ["\uD83D\uDC9E", ["revolving_hearts"]],
    ["\uD83D\uDC9F", ["heart_decoration"]],
    ["\uD83D\uDCA0", ["diamond_shape_with_a_dot_inside"]],
    ["\uD83D\uDCA1", ["bulb"]],
    ["\uD83D\uDCA2", ["anger"]],
    ["\uD83D\uDCA3", ["bomb"]],
    ["\uD83D\uDCA4", ["zzz"]],
    ["\uD83D\uDCA5", ["boom", "collision"]],
    ["\uD83D\uDCA6", ["sweat_drops"]],
    ["\uD83D\uDCA7", ["droplet"]],
    ["\uD83D\uDCA8", ["dash"]],
    ["\uD83D\uDCA9", ["hankey", "poop", "shit"]],
    ["\uD83D\uDCAA", ["muscle"]],
    ["\uD83D\uDCAB", ["dizzy"]],
    ["\uD83D\uDCAC", ["speech_balloon"]],
    ["\uD83D\uDCAD", ["thought_balloon"]],
    ["\uD83D\uDCAE", ["white_flower"]],
    ["\uD83D\uDCAF", ["100"]],
    ["\uD83D\uDCB0", ["moneybag"]],
    ["\uD83D\uDCB1", ["currency_exchange"]],
    ["\uD83D\uDCB2", ["heavy_dollar_sign"]],
    ["\uD83D\uDCB3", ["credit_card"]],
    ["\uD83D\uDCB4", ["yen"]],
    ["\uD83D\uDCB5", ["dollar"]],
    ["\uD83D\uDCB6", ["euro"]],
    ["\uD83D\uDCB7", ["pound"]],
    ["\uD83D\uDCB8", ["money_with_wings"]],
    ["\uD83D\uDCB9", ["chart"]],
    ["\uD83D\uDCBA", ["seat"]],
    ["\uD83D\uDCBB", ["computer"]],
    ["\uD83D\uDCBC", ["briefcase"]],
    ["\uD83D\uDCBD", ["minidisc"]],
    ["\uD83D\uDCBE", ["floppy_disk"]],
    ["\uD83D\uDCBF", ["cd"]],
    ["\uD83D\uDCC0", ["dvd"]],
    ["\uD83D\uDCC1", ["file_folder"]],
    ["\uD83D\uDCC2", ["open_file_folder"]],
    ["\uD83D\uDCC3", ["page_with_curl"]],
    ["\uD83D\uDCC4", ["page_facing_up"]],
    ["\uD83D\uDCC5", ["date"]],
    ["\uD83D\uDCC6", ["calendar"]],
    ["\uD83D\uDCC7", ["card_index"]],
    ["\uD83D\uDCC8", ["chart_with_upwards_trend"]],
    ["\uD83D\uDCC9", ["chart_with_downwards_trend"]],
    ["\uD83D\uDCCA", ["bar_chart"]],
    ["\uD83D\uDCCB", ["clipboard"]],
    ["\uD83D\uDCCC", ["pushpin"]],
    ["\uD83D\uDCCD", ["round_pushpin"]],
    ["\uD83D\uDCCE", ["paperclip"]],
    ["\uD83D\uDCCF", ["straight_ruler"]],
    ["\uD83D\uDCD0", ["triangular_ruler"]],
    ["\uD83D\uDCD1", ["bookmark_tabs"]],
    ["\uD83D\uDCD2", ["ledger"]],
    ["\uD83D\uDCD3", ["notebook"]],
    ["\uD83D\uDCD4", ["notebook_with_decorative_cover"]],
    ["\uD83D\uDCD5", ["closed_book"]],
    ["\uD83D\uDCD6", ["book", "open_book"]],
    ["\uD83D\uDCD7", ["green_book"]],
    ["\uD83D\uDCD8", ["blue_book"]],
    ["\uD83D\uDCD9", ["orange_book"]],
    ["\uD83D\uDCDA", ["books"]],
    ["\uD83D\uDCDB", ["name_badge"]],
    ["\uD83D\uDCDC", ["scroll"]],
    ["\uD83D\uDCDD", ["memo", "pencil"]],
    ["\uD83D\uDCDE", ["telephone_receiver"]],
    ["\uD83D\uDCDF", ["pager"]],
    ["\uD83D\uDCE0", ["fax"]],
    ["\uD83D\uDCE1", ["satellite"]],
    ["\uD83D\uDCE2", ["loudspeaker"]],
    ["\uD83D\uDCE3", ["mega"]],
    ["\uD83D\uDCE4", ["outbox_tray"]],
    ["\uD83D\uDCE5", ["inbox_tray"]],
    ["\uD83D\uDCE6", ["package"]],
    ["\uD83D\uDCE7", ["e-mail"]],
    ["\uD83D\uDCE8", ["incoming_envelope"]],
    ["\uD83D\uDCE9", ["envelope_with_arrow"]],
    ["\uD83D\uDCEA", ["mailbox_closed"]],
    ["\uD83D\uDCEB", ["mailbox"]],
    ["\uD83D\uDCEC", ["mailbox_with_mail"]],
    ["\uD83D\uDCED", ["mailbox_with_no_mail"]],
    ["\uD83D\uDCEE", ["postbox"]],
    ["\uD83D\uDCEF", ["postal_horn"]],
    ["\uD83D\uDCF0", ["newspaper"]],
    ["\uD83D\uDCF1", ["iphone"]],
    ["\uD83D\uDCF2", ["calling"]],
    ["\uD83D\uDCF3", ["vibration_mode"]],
    ["\uD83D\uDCF4", ["mobile_phone_off"]],
    ["\uD83D\uDCF5", ["no_mobile_phones"]],
    ["\uD83D\uDCF6", ["signal_strength"]],
    ["\uD83D\uDCF7", ["camera"]],
    ["\uD83D\uDCF9", ["video_camera"]],
    ["\uD83D\uDCFA", ["tv"]],
    ["\uD83D\uDCFB", ["radio"]],
    ["\uD83D\uDCFC", ["vhs"]],
    ["\uD83D\uDD00", ["twisted_rightwards_arrows"]],
    ["\uD83D\uDD01", ["repeat"]],
    ["\uD83D\uDD02", ["repeat_one"]],
    ["\uD83D\uDD03", ["arrows_clockwise"]],
    ["\uD83D\uDD04", ["arrows_counterclockwise"]],
    ["\uD83D\uDD05", ["low_brightness"]],
    ["\uD83D\uDD06", ["high_brightness"]],
    ["\uD83D\uDD07", ["mute"]],
    ["\uD83D\uDD09", ["speaker"]],
    ["\uD83D\uDD09", ["sound"]],
    ["\uD83D\uDD0A", ["loud_sound"]],
    ["\uD83D\uDD0B", ["battery"]],
    ["\uD83D\uDD0C", ["electric_plug"]],
    ["\uD83D\uDD0D", ["mag"]],
    ["\uD83D\uDD0E", ["mag_right"]],
    ["\uD83D\uDD0F", ["lock_with_ink_pen"]],
    ["\uD83D\uDD10", ["closed_lock_with_key"]],
    ["\uD83D\uDD11", ["key"]],
    ["\uD83D\uDD12", ["lock"]],
    ["\uD83D\uDD13", ["unlock"]],
    ["\uD83D\uDD14", ["bell"]],
    ["\uD83D\uDD15", ["no_bell"]],
    ["\uD83D\uDD16", ["bookmark"]],
    ["\uD83D\uDD17", ["link"]],
    ["\uD83D\uDD18", ["radio_button"]],
    ["\uD83D\uDD19", ["back"]],
    ["\uD83D\uDD1A", ["end"]],
    ["\uD83D\uDD1B", ["on"]],
    ["\uD83D\uDD1C", ["soon"]],
    ["\uD83D\uDD1D", ["top"]],
    ["\uD83D\uDD1E", ["underage"]],
    ["\uD83D\uDD1F", ["keycap_ten"]],
    ["\uD83D\uDD20", ["capital_abcd"]],
    ["\uD83D\uDD21", ["abcd"]],
    ["\uD83D\uDD22", ["1234"]],
    ["\uD83D\uDD23", ["symbols"]],
    ["\uD83D\uDD24", ["abc"]],
    ["\uD83D\uDD25", ["fire"]],
    ["\uD83D\uDD26", ["flashlight"]],
    ["\uD83D\uDD27", ["wrench"]],
    ["\uD83D\uDD28", ["hammer"]],
    ["\uD83D\uDD29", ["nut_and_bolt"]],
    ["\uD83D\uDD2A", ["hocho"]],
    ["\uD83D\uDD2B", ["gun"]],
    ["\uD83D\uDD2C", ["microscope"]],
    ["\uD83D\uDD2D", ["telescope"]],
    ["\uD83D\uDD2E", ["crystal_ball"]],
    ["\uD83D\uDD2F", ["six_pointed_star"]],
    ["\uD83D\uDD30", ["beginner"]],
    ["\uD83D\uDD31", ["trident"]],
    ["\uD83D\uDD32", ["black_square_button"]],
    ["\uD83D\uDD33", ["white_square_button"]],
    ["\uD83D\uDD34", ["red_circle"]],
    ["\uD83D\uDD35", ["large_blue_circle"]],
    ["\uD83D\uDD36", ["large_orange_diamond"]],
    ["\uD83D\uDD37", ["large_blue_diamond"]],
    ["\uD83D\uDD38", ["small_orange_diamond"]],
    ["\uD83D\uDD39", ["small_blue_diamond"]],
    ["\uD83D\uDD3A", ["small_red_triangle"]],
    ["\uD83D\uDD3B", ["small_red_triangle_down"]],
    ["\uD83D\uDD3C", ["arrow_up_small"]],
    ["\uD83D\uDD3D", ["arrow_down_small"]],
    ["\uD83D\uDD50", ["clock1"]],
    ["\uD83D\uDD51", ["clock2"]],
    ["\uD83D\uDD52", ["clock3"]],
    ["\uD83D\uDD53", ["clock4"]],
    ["\uD83D\uDD54", ["clock5"]],
    ["\uD83D\uDD55", ["clock6"]],
    ["\uD83D\uDD56", ["clock7"]],
    ["\uD83D\uDD57", ["clock8"]],
    ["\uD83D\uDD58", ["clock9"]],
    ["\uD83D\uDD59", ["clock10"]],
    ["\uD83D\uDD5A", ["clock11"]],
    ["\uD83D\uDD5B", ["clock12"]],
    ["\uD83D\uDD5C", ["clock130"]],
    ["\uD83D\uDD5D", ["clock230"]],
    ["\uD83D\uDD5E", ["clock330"]],
    ["\uD83D\uDD5F", ["clock430"]],
    ["\uD83D\uDD60", ["clock530"]],
    ["\uD83D\uDD61", ["clock630"]],
    ["\uD83D\uDD62", ["clock730"]],
    ["\uD83D\uDD63", ["clock830"]],
    ["\uD83D\uDD64", ["clock930"]],
    ["\uD83D\uDD65", ["clock1030"]],
    ["\uD83D\uDD66", ["clock1130"]],
    ["\uD83D\uDD67", ["clock1230"]],
    ["\uD83D\uDDFB", ["mount_fuji"]],
    ["\uD83D\uDDFC", ["tokyo_tower"]],
    ["\uD83D\uDDFD", ["statue_of_liberty"]],
    ["\uD83D\uDDFE", ["japan"]],
    ["\uD83D\uDDFF", ["moyai"]],
    ["\uD83D\uDE00", ["grinning"]],
    ["\uD83D\uDE01", ["grin"]],
    ["\uD83D\uDE02", ["joy"]],
    ["\uD83D\uDE03", ["smiley", ",)"]],
    ["\uD83D\uDE04", ["smile", ",)"]],
    ["\uD83D\uDE05", ["sweat_smile"]],
    ["\uD83D\uDE06", ["satisfied"]],
    ["\uD83D\uDE07", ["innocent"]],
    ["\uD83D\uDE08", ["smiling_imp"]],
    ["\uD83D\uDE09", ["wink", ";)"]],
    ["\uD83D\uDE0A", ["blush"]],
    ["\uD83D\uDE0B", ["yum"]],
    ["\uD83D\uDE0C", ["relieved"]],
    ["\uD83D\uDE0D", ["heart_eyes"]],
    ["\uD83D\uDE0E", ["sunglasses"]],
    ["\uD83D\uDE0F", ["smirk"]],
    ["\uD83D\uDE10", ["neutral_face"]],
    ["\uD83D\uDE11", ["expressionless"]],
    ["\uD83D\uDE12", ["unamused"]],
    ["\uD83D\uDE13", ["sweat"]],
    ["\uD83D\uDE14", ["pensive"]],
    ["\uD83D\uDE15", ["confused"]],
    ["\uD83D\uDE16", ["confounded"]],
    ["\uD83D\uDE17", ["kissing"]],
    ["\uD83D\uDE18", ["kissing_heart"]],
    ["\uD83D\uDE19", ["kissing_smiling_eyes"]],
    ["\uD83D\uDE1A", ["kissing_closed_eyes"]],
    ["\uD83D\uDE1B", ["stuck_out_tongue"]],
    ["\uD83D\uDE1C", ["stuck_out_tongue_winking_eye", ";p"]],
    ["\uD83D\uDE1D", ["stuck_out_tongue_closed_eyes"]],
    ["\uD83D\uDE1E", ["disappointed", ",("]],
    ["\uD83D\uDE1F", ["worried"]],
    ["\uD83D\uDE20", ["angry"]],
    ["\uD83D\uDE21", ["rage"]],
    ["\uD83D\uDE22", ["cry", ",'("]],
    ["\uD83D\uDE23", ["persevere"]],
    ["\uD83D\uDE24", ["triumph"]],
    ["\uD83D\uDE25", ["disappointed_relieved"]],
    ["\uD83D\uDE26", ["frowning"]],
    ["\uD83D\uDE27", ["anguished"]],
    ["\uD83D\uDE28", ["fearful"]],
    ["\uD83D\uDE29", ["weary"]],
    ["\uD83D\uDE2A", ["sleepy"]],
    ["\uD83D\uDE2B", ["tired_face"]],
    ["\uD83D\uDE2C", ["grimacing"]],
    ["\uD83D\uDE2D", ["sob", ",'("]],
    ["\uD83D\uDE2E", ["open_mouth"]],
    ["\uD83D\uDE2F", ["hushed"]],
    ["\uD83D\uDE30", ["cold_sweat"]],
    ["\uD83D\uDE31", ["scream"]],
    ["\uD83D\uDE32", ["astonished"]],
    ["\uD83D\uDE33", ["flushed"]],
    ["\uD83D\uDE34", ["sleeping"]],
    ["\uD83D\uDE35", ["dizzy_face"]],
    ["\uD83D\uDE36", ["no_mouth"]],
    ["\uD83D\uDE37", ["mask"]],
    ["\uD83D\uDE38", ["smile_cat"]],
    ["\uD83D\uDE39", ["joy_cat"]],
    ["\uD83D\uDE3A", ["smiley_cat"]],
    ["\uD83D\uDE3B", ["heart_eyes_cat"]],
    ["\uD83D\uDE3C", ["smirk_cat"]],
    ["\uD83D\uDE3D", ["kissing_cat"]],
    ["\uD83D\uDE3E", ["pouting_cat"]],
    ["\uD83D\uDE3F", ["crying_cat_face"]],
    ["\uD83D\uDE40", ["scream_cat"]],
    ["\uD83D\uDE45", ["no_good"]],
    ["\uD83D\uDE46", ["ok_woman"]],
    ["\uD83D\uDE47", ["bow"]],
    ["\uD83D\uDE48", ["see_no_evil"]],
    ["\uD83D\uDE49", ["hear_no_evil"]],
    ["\uD83D\uDE4A", ["speak_no_evil"]],
    ["\uD83D\uDE4B", ["raising_hand"]],
    ["\uD83D\uDE4C", ["raised_hands"]],
    ["\uD83D\uDE4D", ["person_frowning"]],
    ["\uD83D\uDE4E", ["person_with_pouting_face"]],
    ["\uD83D\uDE4F", ["pray"]],
    ["\uD83D\uDE80", ["rocket"]],
    ["\uD83D\uDE81", ["helicopter"]],
    ["\uD83D\uDE82", ["steam_locomotive"]],
    ["\uD83D\uDE83", ["railway_car"]],
    ["\uD83D\uDE8B", ["train"]],
    ["\uD83D\uDE84", ["bullettrain_side"]],
    ["\uD83D\uDE85", ["bullettrain_front"]],
    ["\uD83D\uDE86", ["train2"]],
    ["\uD83D\uDE87", ["metro"]],
    ["\uD83D\uDE88", ["light_rail"]],
    ["\uD83D\uDE89", ["station"]],
    ["\uD83D\uDE8A", ["tram"]],
    ["\uD83D\uDE8C", ["bus"]],
    ["\uD83D\uDE8D", ["oncoming_bus"]],
    ["\uD83D\uDE8E", ["trolleybus"]],
    ["\uD83D\uDE8F", ["busstop"]],
    ["\uD83D\uDE90", ["minibus"]],
    ["\uD83D\uDE91", ["ambulance"]],
    ["\uD83D\uDE92", ["fire_engine"]],
    ["\uD83D\uDE93", ["police_car"]],
    ["\uD83D\uDE94", ["oncoming_police_car"]],
    ["\uD83D\uDE95", ["taxi"]],
    ["\uD83D\uDE96", ["oncoming_taxi"]],
    ["\uD83D\uDE97", ["car", "red_car"]],
    ["\uD83D\uDE98", ["oncoming_automobile"]],
    ["\uD83D\uDE99", ["blue_car"]],
    ["\uD83D\uDE9A", ["truck"]],
    ["\uD83D\uDE9B", ["articulated_lorry"]],
    ["\uD83D\uDE9C", ["tractor"]],
    ["\uD83D\uDE9D", ["monorail"]],
    ["\uD83D\uDE9E", ["mountain_railway"]],
    ["\uD83D\uDE9F", ["suspension_railway"]],
    ["\uD83D\uDEA0", ["mountain_cableway"]],
    ["\uD83D\uDEA1", ["aerial_tramway"]],
    ["\uD83D\uDEA2", ["ship"]],
    ["\uD83D\uDEA3", ["rowboat"]],
    ["\uD83D\uDEA4", ["speedboat"]],
    ["\uD83D\uDEA5", ["traffic_light"]],
    ["\uD83D\uDEA6", ["vertical_traffic_light"]],
    ["\uD83D\uDEA7", ["construction"]],
    ["\uD83D\uDEA8", ["rotating_light"]],
    ["\uD83D\uDEA9", ["triangular_flag_on_post"]],
    ["\uD83D\uDEAA", ["door"]],
    ["\uD83D\uDEAB", ["no_entry_sign"]],
    ["\uD83D\uDEAC", ["smoking"]],
    ["\uD83D\uDEAD", ["no_smoking"]],
    ["\uD83D\uDEAE", ["put_litter_in_its_place"]],
    ["\uD83D\uDEAF", ["do_not_litter"]],
    ["\uD83D\uDEB0", ["potable_water"]],
    ["\uD83D\uDEB1", ["non-potable_water"]],
    ["\uD83D\uDEB2", ["bike"]],
    ["\uD83D\uDEB3", ["no_bicycles"]],
    ["\uD83D\uDEB4", ["bicyclist"]],
    ["\uD83D\uDEB5", ["mountain_bicyclist"]],
    ["\uD83D\uDEB6", ["walking"]],
    ["\uD83D\uDEB7", ["no_pedestrians"]],
    ["\uD83D\uDEB8", ["children_crossing"]],
    ["\uD83D\uDEB9", ["mens"]],
    ["\uD83D\uDEBA", ["womens"]],
    ["\uD83D\uDEBB", ["restroom"]],
    ["\uD83D\uDEBC", ["baby_symbol"]],
    ["\uD83D\uDEBD", ["toilet"]],
    ["\uD83D\uDEBE", ["wc"]],
    ["\uD83D\uDEBF", ["shower"]],
    ["\uD83D\uDEC0", ["bath"]],
    ["\uD83D\uDEC1", ["bathtub"]],
    ["\uD83D\uDEC2", ["passport_control"]],
    ["\uD83D\uDEC3", ["customs"]],
    ["\uD83D\uDEC4", ["baggage_claim"]],
    ["\uD83D\uDEC5", ["left_luggage"]],
    ["\u0023\u20E3", ["hash"]],
    ["\u0030\u20E3", ["zero"]],
    ["\u0031\u20E3", ["one"]],
    ["\u0032\u20E3", ["two"]],
    ["\u0033\u20E3", ["three"]],
    ["\u0034\u20E3", ["four"]],
    ["\u0035\u20E3", ["five"]],
    ["\u0036\u20E3", ["six"]],
    ["\u0037\u20E3", ["seven"]],
    ["\u0038\u20E3", ["eight"]],
    ["\u0039\u20E3", ["nine"]]
];
