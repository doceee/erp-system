class CalculateVacationDaysHandler {
    handle(vacationDaysPerYear, calcDuration) {
        return Math.ceil((1 / 12) * vacationDaysPerYear * calcDuration);
    }
}

module.exports = CalculateVacationDaysHandler;
