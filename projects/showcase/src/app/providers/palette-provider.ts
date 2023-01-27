// https://carto.com/carto-colors/
const boldPalette = ['#3969AC', '#E73F74', '#F2B701', '#80BA5A', '#E68310', '#008695', '#7F3C8D', '#CF1C90', '#f97b72', '#11A579', '#4b4b8f', '#A5AA99'];
const vividPalette = ['#E58606', '#5D69B1', '#52BCA3', '#99C945', '#CC61B0', '#24796C', '#DAA51B', '#2F8AC4', '#764E9F', '#ED645A', '#CC3A8E', '#A5AA99'];

// https://colorbrewer2.org/
const brewerDarkPalette = ['#e36667', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#e6de00', '#c36d3c', '#f781bf', '#999999'];
const brewerLightPalette = ['#8dd3c7', '#ffff4d', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9'];
const brewerPalette = [...brewerDarkPalette, ...brewerLightPalette];

// custom palette generated with https://paletton.com/
const customPalette = [
  ['#F594A9', '#EE6885', '#DE4365', '#D01B42', '#9F0D2C'],
  ['#FFE89A', '#FFDF6F', '#F0CB49', '#E1B51D', '#AC890E'],
  ['#938DD6', '#6860BC', '#4C43A7', '#31279C', '#211978'],
  ['#B0ED8F', '#8FE263', '#72D13F', '#55C419', '#3C960C'],
  ['#FFBD9A', '#FFA16F', '#F08349', '#E1611D', '#AC450E'],
  ['#FFF99A', '#FFF66F', '#F0E649', '#E1D51D', '#ACA30E'],
  ['#AC86D3', '#8758B7', '#6D3AA2', '#5A1E98', '#421174'],
  ['#7ED1B8', '#4EB495', '#309F7D', '#13956D', '#097252'],
  ['#FFD79A', '#FFC66F', '#F0AE49', '#E1941D', '#AC6E0E'],
  ['#E3F996', '#D6F56B', '#C2E546', '#ADD71C', '#83A50D'],
  ['#D983C8', '#C054AC', '#AC3495', '#A11586', '#7C0A66'],
  ['#84A8D0', '#5681B2', '#38689D', '#1D5593', '#113E71'],
];

export default brewerPalette;
