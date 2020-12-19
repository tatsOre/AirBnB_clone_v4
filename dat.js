#!/usr/bin/node

st = '2017-03-25T02:17:06.000000';

datetime = new Date(st);
const day = getNumberWithOrdinal(datetime.getDate());
const month = new Intl.DateTimeFormat('en-US', { month: 'long'}).format(datetime)
const year = datetime.getFullYear();

function getNumberWithOrdinal(n) {
    const ord = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (ord[(v - 20) % 10] || ord[v] || ord[0]);
}



  console.log(day);
  console.log(month);
  console.log(year);

  console.log('hola' + 2)