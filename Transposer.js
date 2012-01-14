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
            majorChords = ['C', 'D\u266d', 'D', 'E\u266d', 'E', 'F', 'F\u266f', 'G', 'A\u266d', 'A', 'B\u266d', 'B'],
            minorChords = ['C', 'C\u266f', 'D', 'D\u266f', 'E', 'F', 'F\u266f', 'G', 'G\u266f', 'A', 'B\u266d', 'B'],
            chordsInKey = { // Note: only need cannonical key names.
                'C':   ['C',  'x',  'D',  'x',  'E',  'F',  'x',  'G',  'x',  'A',  'x',  'B'],
                'Am':  ['C',  'x',  'D',  'x',  'E',  'F',  'x',  'G',  'x',  'A',  'x',  'B'],
                'G':   ['C',  'x',  'D',  'x',  'E',  'x',  'F♯', 'G',  'x',  'A',  'x',  'B'],
                'Em':  ['C',  'x',  'D',  'x',  'E',  'x',  'F♯', 'G',  'x',  'A',  'x',  'B'],
                'D':   ['x',  'C♯', 'D',  'x',  'E',  'x',  'F♯', 'G',  'x',  'A',  'x',  'B'],
                'Bm':  ['x',  'C♯', 'D',  'x',  'E',  'x',  'F♯', 'G',  'x',  'A',  'x',  'B'],
                'A':   ['x',  'C♯', 'D',  'x',  'E',  'x',  'F♯', 'x',  'G♯', 'A',  'x',  'B'],
                'F♯m': ['x',  'C♯', 'D',  'x',  'E',  'x',  'F♯', 'x',  'G♯', 'A',  'x',  'B'],
                'E':   ['x',  'C♯', 'x',  'D♯', 'E',  'x',  'F♯', 'x',  'G♯', 'A',  'x',  'B'],
                'C♯m': ['x',  'C♯', 'x',  'D♯', 'E',  'x',  'F♯', 'x',  'G♯', 'A',  'x',  'B'],
                'B':   ['x',  'C♯', 'x',  'D♯', 'E',  'x',  'F♯', 'x',  'G♯', 'x',  'A♯', 'B'],
                'G♯m': ['x',  'C♯', 'x',  'D♯', 'E',  'x',  'F♯', 'x',  'G♯', 'x',  'A♯', 'B'],
                'F♯':  ['x',  'C♯', 'x',  'D♯', 'x',  'E♯', 'F♯', 'x',  'G♯', 'x',  'A♯', 'B'],
                'D♯m': ['x',  'C♯', 'x',  'D♯', 'x',  'E♯', 'F♯', 'x',  'G♯', 'x',  'A♯', 'B'],
                'C♯':  ['B♯', 'C♯', 'x',  'D♯', 'x',  'E♯', 'F♯', 'x',  'G♯', 'x',  'A♯', 'x'],
                'A♯m': ['B♯', 'C♯', 'x',  'D♯', 'x',  'E♯', 'F♯', 'x',  'G♯', 'x',  'A♯', 'x'],
                'C♭':  ['x',  'D♭', 'x',  'E♭', 'F♭', 'x',  'G♭', 'x',  'A♭', 'x',  'B♭', 'C♭'],
                'A♭m': ['x',  'D♭', 'x',  'E♭', 'F♭', 'x',  'G♭', 'x',  'A♭', 'x',  'B♭', 'C♭'],
                'G♭':  ['x',  'D♭', 'x',  'E♭', 'x',  'F',  'G♭', 'x',  'A♭', 'x',  'B♭', 'C♭'],
                'E♭m': ['x',  'D♭', 'x',  'E♭', 'x',  'F',  'G♭', 'x',  'A♭', 'x',  'B♭', 'C♭'],
                'D♭':  ['C',  'D♭', 'x',  'E♭', 'x',  'F',  'G♭', 'x',  'A♭', 'x',  'B♭', 'x'],
                'B♭m': ['C',  'D♭', 'x',  'E♭', 'x',  'F',  'G♭', 'x',  'A♭', 'x',  'B♭', 'x'],
                'A♭':  ['C',  'D♭', 'x',  'E♭', 'x',  'F',  'x',  'G',  'A♭', 'x',  'B♭', 'x'],
                'Fm':  ['C',  'D♭', 'x',  'E♭', 'x',  'F',  'x',  'G',  'A♭', 'x',  'B♭', 'x'],
                'E♭':  ['C',  'x',  'D',  'E♭', 'x',  'F',  'x',  'G',  'A♭', 'x',  'B♭', 'x'],
                'Cm':  ['C',  'x',  'D',  'E♭', 'x',  'F',  'x',  'G',  'A♭', 'x',  'B♭', 'x'],
                'B♭':  ['C',  'x',  'D',  'E♭', 'x',  'F',  'x',  'G',  'x',  'A',  'B♭', 'x'],
                'Gm':  ['C',  'x',  'D',  'E♭', 'x',  'F',  'x',  'G',  'x',  'A',  'B♭', 'x'],
                'F':   ['C',  'x',  'D',  'x',  'E',  'F',  'x',  'G',  'x',  'A',  'B♭', 'x'],
                'Dm':  ['C',  'x',  'D',  'x',  'E',  'F',  'x',  'G',  'x',  'A',  'B♭', 'x'],
            },
            chords = majorChords,
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
                    chords = minorChords;
                }
                else {
                    chords = majorChords;
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
                                h = h.replace(m[i], minorChords[x]);
                            }
                            else { // it's a major chord.
                                h = h.replace(m[i], majorChords[x]);
                            }
                        }
                        else { // a proper key has been set.
                            h = h.replace(m[i], chords[x]);
                        }
                    }
                }
                this.innerHTML = h;
            }
            if ($(this).hasClass('key')) {
                key = keyName(this.innerHTML);
                chords = chordsInKey[key];
                if (!chords) {
                    alert('Could not find key "' + key + '".');
                    chords = majorChords;
                }
            }
        });
    };
}(jQuery));
