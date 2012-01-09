/**
 * A jQuery plugin to transpose the key in song sheets.
 * @author Eric L. Blossom
 */
(function ($) {
    /**
     * Transpose up or down by the specified number of half steps.
     * Looks for and replaces all the chords in the document.
     * usage: $('.chord').elb_music_transpose(1);  // transpose up one half step.
     *        $('.chord').elb_music_transpose(-2); // transpose down one step.
     * NOTE (or BUG): Chords must be upper case. Minor chords must be of the form Am, not a.
     * Don't forget to complete unicode sharps and flats.
     */
    $.fn.elb_music_transpose = function (theHalfSteps) {
        var chordLetters = 'C D EF G A B',
            chords = ['C', 'D\u266d', 'D', 'E\u266d', 'E', 'F', 'F\u266f', 'G', 'A\u266d', 'A', 'B\u266d', 'B'],
            minorChords = ['C', 'C\u266f', 'D', 'D\u266f', 'E', 'F', 'F\u266f', 'G', 'G\u266f', 'A', 'B\u266d', 'B'],
            aChord = /[A-G][#b\u266d\u266f]?/;
        return this.each(function (theIndex, theElement) {
            var h = this.innerHTML,
                m = h.match(aChord),
                x;
            if (m) {
                x = chordLetters.search(m[0][0]);
                if (-1 < x) {
                    if (m[0].match('.[#\u266f]')) {
                        x += 1;
                    }
                    if (m[0].match('.[b\u266d]')) {
                        x -= 1;
                    }
                    x += theHalfSteps;
                    while (x < 0) { /* JavaScript doesn't do modulo negative numbers. */
                        x += chordLetters.length;
                    }
                    x %= chordLetters.length;
                    if (-1 < h.indexOf('m') && !h.match('maj|dom')) { // then it's a minor (or diminished) chord.
                        this.innerHTML = h.replace(m[0], minorChords[x]);
                    }
                    else { // it's a major chord.
                        this.innerHTML = h.replace(m[0], chords[x]);
                    }
                }
            }
        });
    };
}(jQuery));
