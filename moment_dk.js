moment.locale('dk', {
    months : "januar_februar_marts_april_maj_juni_juli_august_september_oktober_november_december".split("_"),
    monthsShort : "jan._feb._mar._apr._maj_juni_juli_aug._sept._okt._nov._dec.".split("_"),
    weekdays : "søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag".split("_"),
    weekdaysShort : "søn._man._tir._ons._tor._fre._lør.".split("_"),
    weekdaysMin : "Sø_Ma_Ti_On_To_Fr_Lø".split("_"),
    longDateFormat : {
        LT : "HH:mm",
        LTS : "HH:mm:ss",
        L : "DD.MM.YYYY",
        LL : "D MMMM YYYY",
        LLL : "D MMMM YYYY LT",
        LLLL : "dddd D MMMM YYYY LT"
    },
    calendar : {
        sameDay: "[Aujourd'hui à] LT",
        nextDay: '[Demain à] LT',
        nextWeek: 'dddd [à] LT',
        lastDay: '[Hier à] LT',
        lastWeek: 'dddd [dernier à] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : "om %s",
        past : "%s siden",
        s : "sekunder",
        m : "et minut",
        mm : "%d minutter",
        h : "en time",
        hh : "%d timer",
        d : "en dag",
        dd : "%d dage",
        M : "en måned",
        MM : "%d måneder",
        y : "et år",
        yy : "%d år"
    },
    ordinalParse : /\d{1,2}(første|anden)/,
    ordinal : function (number) {
        return number + (number === 1 ? 'først' : 'anden');
    },
    meridiemParse: /PD|MD/,
    isPM: function (input) {
        return input.charAt(0) === 'M';
    },
    // in case the meridiem units are not separated around 12, then implement
    // this function (look at locale/id.js for an example)
    // meridiemHour : function (hour, meridiem) {
    //     return /* 0-23 hour, given meridiem token and hour 1-12 */
    // },
    meridiem : function (hours, minutes, isLower) {
        return hours < 12 ? 'PD' : 'MD';
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});