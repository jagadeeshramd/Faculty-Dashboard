exports.mma = function minmaxavg(x) {
    var minm, maxm, avgm;
    minm = 100;
    maxm = 0;
    avgm = 0;
    for (let i of x) {

        if (i['total'] < minm)
            minm = i['total'];

        if (i['total'] > maxm)
            maxm = i['total'];

        avgm += i['total'];
    }
    avgm = avgm / x.length;
    return [minm, maxm, avgm];
};

exports.ass_to_full = function ass_to_fullname(assessment) {
    if (assessment.startsWith('A'))
        assessment = "Assignment " + assessment.slice(1, assessment.length);
    else if (assessment.startsWith('Q'))
        assessment = "Quiz " + assessment.slice(1, assessment.length);
    else if (assessment.startsWith('P'))
        assessment = "Periodical " + assessment.slice(1, assessment.length);
    else if (assessment.startsWith('T'))
        assessment = "Tutorial " + assessment.slice(1, assessment.length);
    return assessment;
};

exports.ass_to_short = function ass_to_short(ass_name) {
    if (ass_name.startsWith('Assignment'))
        ass_name = "A" + ass_name.slice(11, ass_name.length);
    else if (ass_name.startsWith('Quiz'))
        ass_name = "Q" + ass_name.slice(5, ass_name.length);
    else if (ass_name.startsWith('Periodical'))
        ass_name = "P" + ass_name.slice(11, ass_name.length);
    else if (ass_name.startsWith('Tutorial'))
        ass_name = "T" + ass_name.slice(9, ass_name.length);
    return ass_name;
}

exports.rc_CA = function recalc_CA(result_mark, ass_wt) {
    var m = {};
    for (var i of result_mark) {

        var r = i['roll_number'];
        var ca = 0;
        for (var k in ass_wt) {
            if (i[k] != null)
                ca += i[k] * ass_wt[k];
        }
        m[r] = ca.toFixed(2);

    }
    return m;
};

exports.cgrade = function calcgrade(x, lm, g) {

    console.log(x, lm, g);
    var l = 0;
    var r = lm.length - 1;
    var ind = -1;

    while (l <= r) {
        var m = Math.floor((l + r) / 2);
        if (m == (lm.length - 1)) {
            if (x >= lm[m]) {
                ind = m;
                break;
            }
            else {
                r -= 1;
            }
        } else if ((lm[m] <= x) && (x < lm[m + 1])) {
            ind = m;
            break;
        } else if (x > lm[m]) {
            l += 1;
        } else {
            r -= 1;
        }
    }
    if (ind == -1) {
        return 'F';
    }
    else {
        return g[ind];
    }
};