/**
 * A jQuery plugin to transpose the key in song sheets.
 * @author Eric L. Blossom
 */
(function ($) {
    /**
     * Transpose up or down by the specified number of half steps.
     * Looks for and replaces all the chords in the document.
     * usage: $('.key,.chord').elb_music_transpose(1);  // transpose up one half step.
     *        $('.key,.chord').elb_music_transpose(-2); // transpose down one step.
     * NOTE (or BUG): Chords must be upper case. Minor chords must be of the form Am, not a.
     *      Lower case for the key is OK and interpreted as a minor key.
     */
    $.fn.elb_music_transpose = function (theHalfSteps) {
        var chordLetters = 'C D EF G A B',
            majorTonics = ['C', 'D\u266d', 'D', 'E\u266d', 'E', 'F', 'F\u266f', 'G', 'A\u266d', 'A', 'B\u266d', 'B'],
            minorTonics = ['C', 'C\u266f', 'D', 'D\u266f', 'E', 'F', 'F\u266f', 'G', 'G\u266f', 'A', 'B\u266d', 'B'],
            tonesInKey = { // Note: only need cannonical key names.
                'C':   ['C',  'C♯', 'D',  'D♯', 'E',  'F',  'F♯', 'G',  'G♯', 'A',  'A♯', 'B'],
                'Am':  ['C',  'C♯', 'D',  'D♯', 'E',  'F',  'F♯', 'G',  'G♯', 'A',  'A♯', 'B'],
                'G':   ['C',  'C♯', 'D',  'D♯', 'E',  'F',  'F♯', 'G',  'G♯', 'A',  'A♯', 'B'],
                'Em':  ['C',  'C♯', 'D',  'D♯', 'E',  'F',  'F♯', 'G',  'G♯', 'A',  'A♯', 'B'],
                'D':   ['C',  'C♯', 'D',  'D♯', 'E',  'F',  'F♯', 'G',  'G♯', 'A',  'A♯', 'B'],
                'Bm':  ['C',  'C♯', 'D',  'D♯', 'E',  'F',  'F♯', 'G',  'G♯', 'A',  'A♯', 'B'],
                'A':   ['C',  'C♯', 'D',  'D♯', 'E',  'F',  'F♯', 'G',  'G♯', 'A',  'A♯', 'B'],
                'F♯m': ['C',  'C♯', 'D',  'D♯', 'E',  'F',  'F♯', 'G',  'G♯', 'A',  'A♯', 'B'],
                'E':   ['C',  'C♯', 'D',  'D♯', 'E',  'F',  'F♯', 'G',  'G♯', 'A',  'A♯', 'B'],
                'C♯m': ['C',  'C♯', 'D',  'D♯', 'E',  'F',  'F♯', 'G',  'G♯', 'A',  'A♯', 'B'],
                'B':   ['C',  'C♯', 'D',  'D♯', 'E',  'F',  'F♯', 'G',  'G♯', 'A',  'A♯', 'B'],
                'G♯m': ['C',  'C♯', 'D',  'D♯', 'E',  'F',  'F♯', 'G',  'G♯', 'A',  'A♯', 'B'],
                'F♯':  ['C',  'C♯', 'D',  'D♯', 'E',  'E♯', 'F♯', 'G',  'G♯', 'A',  'A♯', 'B'],
                'D♯m': ['C',  'C♯', 'D',  'D♯', 'E',  'E♯', 'F♯', 'G',  'G♯', 'A',  'A♯', 'B'],
                'C♯':  ['B♯', 'C♯', 'D',  'D♯', 'E',  'E♯', 'F♯', 'G',  'G♯', 'A',  'A♯', 'B'],
                'A♯m': ['B♯', 'C♯', 'D',  'D♯', 'E',  'E♯', 'F♯', 'G',  'G♯', 'A',  'A♯', 'B'],
                'C♭':  ['C',  'D♭', 'D',  'E♭', 'F♭', 'F',  'G♭', 'G',  'A♭', 'A',  'B♭', 'C♭'],
                'A♭m': ['C',  'D♭', 'D',  'E♭', 'F♭', 'F',  'G♭', 'G',  'A♭', 'A',  'B♭', 'C♭'],
                'G♭':  ['C',  'D♭', 'D',  'E♭', 'E',  'F',  'G♭', 'G',  'A♭', 'A',  'B♭', 'C♭'],
                'E♭m': ['C',  'D♭', 'D',  'E♭', 'E',  'F',  'G♭', 'G',  'A♭', 'A',  'B♭', 'C♭'],
                'D♭':  ['C',  'D♭', 'D',  'E♭', 'E',  'F',  'G♭', 'G',  'A♭', 'A',  'B♭', 'C♭'],
                'B♭m': ['C',  'D♭', 'D',  'E♭', 'E',  'F',  'G♭', 'G',  'A♭', 'A',  'B♭', 'C♭'],
                'A♭':  ['C',  'D♭', 'D',  'E♭', 'E',  'F',  'G♭', 'G',  'A♭', 'A',  'B♭', 'C♭'],
                'Fm':  ['C',  'D♭', 'D',  'E♭', 'E',  'F',  'G♭', 'G',  'A♭', 'A',  'B♭', 'C♭'],
                'E♭':  ['C',  'D♭', 'D',  'E♭', 'E',  'F',  'G♭', 'G',  'A♭', 'A',  'B♭', 'C♭'],
                'Cm':  ['C',  'D♭', 'D',  'E♭', 'E',  'F',  'G♭', 'G',  'A♭', 'A',  'B♭', 'C♭'],
                'B♭':  ['C',  'D♭', 'D',  'E♭', 'E',  'F',  'G♭', 'G',  'A♭', 'A',  'B♭', 'C♭'],
                'Gm':  ['C',  'D♭', 'D',  'E♭', 'E',  'F',  'G♭', 'G',  'A♭', 'A',  'B♭', 'C♭'],
                'F':   ['C',  'D♭', 'D',  'E♭', 'E',  'F',  'G♭', 'G',  'A♭', 'A',  'B♭', 'C♭'],
                'Dm':  ['C',  'D♭', 'D',  'E♭', 'E',  'F',  'G♭', 'G',  'A♭', 'A',  'B♭', 'C♭'],
            },
            tones = majorTonics,
            aNote = /[A-G][#b\u266d\u266f]?/g,
            key,
            keyName = function(rawName) {
                var m, tonic, quality = '',
                    aKey = /([a-gA-G][♯♭]?)( minor|m| major|M|)?/;
                rawName = rawName.replace('#', '♯').replace('b', '♭');
                m = rawName.match(aKey);
                if (m) {
                    if (1 < m.length && m[1]) {
                        if (m[1].match('[a-g]')) { // minor
                            tonic = m[1].toUpperCase();
                            quality = 'm';
                        }
                        else {
                            tonic = m[1];
                        }
                        if (2 < m.length && m[2]) {
                            quality = {'m': 'm', ' minor': 'm', 'M': '', ' major': ''}[m[2]];
                        }
                        return tonic + quality;;
                    }
                }
                alert('What kind of key is "' + rawName + '"?');
                return rawName;
            };

        return this.each(function (theIndex, theElement) {
            var h = this.innerHTML,
                i, m, x;
            if ($(this).hasClass('key')) {
                key = keyName(h);
                if (key[key.length-1] === 'm' ) {
                    tones = minorTonics;
                }
                else {
                    tones = majorTonics;
                }
            }
            m = h.match(aNote);
            if (m) {
                for (i = 0; i < m.length; i++) {
                    x = chordLetters.search(m[i][0]);
                    if (-1 < x) {
                        if (m[i].match('.[#\u266f]')) {
                            x += 1;
                        }
                        if (m[i].match('.[b\u266d]')) {
                            x -= 1;
                        }
                        x += theHalfSteps;
                        while (x < 0) { // JavaScript doesn't do modulo negative numbers.
                            x += chordLetters.length;
                        }
                        x %= chordLetters.length;
                        if (!key) { // then no key was given in the input.
                            // Guess based on chord.
                            if (-1 < h.indexOf('m') && !h.match('maj|dom')) { // then it's a minor (or diminished) chord.
                                h = h.replace(m[i], minorTonics[x]);
                            }
                            else { // it's a major chord.
                                h = h.replace(m[i], majorTonics[x]);
                            }
                        }
                        else { // a proper key has been set.
                            h = h.replace(m[i], tones[x]);
                        }
                    }
                }
                this.innerHTML = h;
            }
            if ($(this).hasClass('key')) {
                key = keyName(this.innerHTML);
                tones = tonesInKey[key];
                if (!tones) {
                    alert('Could not find key "' + key + '".');
                    tones = majorTonics;
                }
            }
        });
    };
}(jQuery));
