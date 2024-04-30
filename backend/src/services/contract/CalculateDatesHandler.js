const dayjs = require('dayjs');

class CalculateDatesHandler {
    handle(startDate, endDate, duration) {
        let calcDuration, calcEndDate;
        startDate = dayjs(startDate);

        if (endDate) {
            endDate = dayjs(endDate);
            calcDuration = Math.ceil(endDate.diff(startDate, 'month', true));
            calcEndDate = endDate.format('YYYY-MM-DD');
        } else {
            calcDuration = duration;
            calcEndDate = startDate
                .add(duration, 'month')
                .subtract(1, 'day')
                .format('YYYY-MM-DD');
        }

        return { calcEndDate, calcDuration };
    }
}

module.exports = CalculateDatesHandler;
