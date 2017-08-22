export default function FeedFactory ($http) {
  "ngInject";

  const parser = new DOMParser();

  return {
    load: url => {
      let feed = [];
      
      feed.$resolved = false;
      feed.$promise = $http.get('https://api.rss2json.com/v1/api.json', {params: {rss_url: url}});

      feed.$promise.then(
        response => {

          Array.prototype.splice.apply(feed, [0, 0].concat(response.data.items.splice(0, 10)));
          feed.$resolved = true;
        }
      );

      return feed;
    }
  }
}