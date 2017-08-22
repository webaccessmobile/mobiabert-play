export default function ($feed, G1FeedURL, ABERTFeedURL, $timeout, moment) {
  "ngInject";

  const $ctrl = this;

  $ctrl.G1feed = $feed.load(G1FeedURL);
  $ctrl.ABERTfeed = $feed.load(ABERTFeedURL);
  $ctrl.printDate = date => {
    let mDate = moment(date, 'YYYY-MM-DD HH:mm:ss');
    return `${mDate.format('HH')}h${mDate.format('mm')} ${mDate.format('DD/MM/YYYY')}`;
  }
};