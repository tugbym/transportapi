module.exports = function(url, values, hidden) {
    return {
        createCjTemplate: function(base, docs) {
            var cj = {};
            cj.collection = {};
            cj.collection.version = "1.0";
            cj.collection.href = base + '/api/' + url;
            cj.collection.links = [];
            cj.collection.links.push({
                'rel': 'home',
                'href': base
            });
            cj.collection.items = [];
            if(docs.length) {
                module.exports(url, values, hidden).renderItems(cj, base, docs);
            } else {
                module.exports(url, values, hidden).renderItem(cj, base, docs);
            }
            cj.collection.items.links = [];
            cj.collection.queries = [];
            module.exports(url, values, hidden).renderQueries(cj, base, docs);
            cj.collection.template = {};
            cj.collection.template.data = [];
            module.exports(url, values, hidden).renderTemplate(cj, docs);
            return cj;
        },
        createCjError: function(base, err, statusCode) {
            var cj = {};
            cj.collection = {};
            cj.collection.version = "1.0";
            cj.collection.href = base + '/api/' + url;
            cj.collection.links = [];
            cj.collection.links.push({
                'rel': 'home',
                'href': base
            });
            cj.collection.error = {};
            switch(statusCode) {
                case 400:
                    cj.collection.error['title'] = "Bad Request";
                    break;
                case 401:
                    cj.collection.error['title'] = "Unauthorized";
                    break;
                case 403:
                    cj.collection.error['title'] = "Forbidden";
                    break;
                case 404:
                    cj.collection.error['title'] = "Page Not Found";
                    break;
                case 409:
                    cj.collection.error['title'] = "Conflict";
                    break;
                case 500:
                    cj.collection.error['title'] = "Internal Server Error";
                    break;
                default:
                    cj.collection.error['title'] = "Unknown Error";
                    break;
            }
            cj.collection.error['code'] = statusCode;
            cj.collection.error['message'] = err;
            return cj;
        },
        renderItems: function(cj, base, docs) {
            for(var i = 0; i < docs.length; i++) {
                var item = {};
                item.href = base + '/api/' + url + '/' + docs[i].id;
                item.data = [];
                item.links = [];
                var p = 0;
                for(var d in docs[i]) {
                    if(values.indexOf(d) != -1) {
                        if(docs[i][d]) {
                            item.data[p++] = {
                                'name': d,
                                'value': docs[i][d],
                                'prompt': d
                            };
                        }
                    }
                }
                var friends = docs[i].friends;
                var r = 0,
                    q = 0;
                if(friends) {
                    if(friends[0]) {
                        for(q in friends) {
                            if(friends[q].mutual) {
                                item.links[r++] = {
                                    'rel': 'friend',
                                    'href': base + '/api/' + url + '/' + friends[q].userID,
                                    'prompt': 'Friend'
                                }
                            } else {
                                item.links[r++] = {
                                    'rel': 'contact',
                                    'href': base + '/api/' + url + '/' + friends[q].userID,
                                    'prompt': 'Contact'
                                }
                            }
                        }
                    }
                }
                var transportID = docs.transportID;
                var type = docs.transportType;
                if(transportID) {
                    item.links[r++] = {
                        'rel': 'item',
                        'href': base + '/api/' + type + '/' + transportID,
                        'prompt': 'Current Location'
                    }
                }
                cj.collection.items.push(item);
            }
        },
        renderItem: function(cj, base, docs) {
            var item = {};
            item.href = base + '/api/' + url + '/' + docs.id;
            item.data = [];
            item.links = [];
            var p = 0;
            for(var d in docs) {
                if(values.indexOf(d) != -1) {
                    if(docs[d]) {
                        item.data[p++] = {
                            'name': d,
                            'value': docs[d],
                            'prompt': d
                        };
                    }
                }
            }
            var friends = docs.friends;
            var r = 0,
                q = 0;
            if(friends) {
                if(friends[0]) {
                    for(q in friends) {
                        if(friends[q].mutual) {
                            item.links[r++] = {
                                'rel': 'friend',
                                'href': base + '/api/' + url + '/' + friends[q].userID,
                                'prompt': 'Friend'
                            }
                        } else {
                            item.links[r++] = {
                                'rel': 'contact',
                                'href': base + '/api/' + url + '/' + friends[q].userID,
                                'prompt': 'Contact'
                            }
                        }
                    }
                }
            }
            var transportID = docs.transportID;
            var type = docs.transportType;
            if(transportID) {
                item.links[r++] = {
                    'rel': 'item',
                    'href': base + '/api/' + type + '/' + transportID,
                    'prompt': 'Current Location'
                }
            }
            cj.collection.items.push(item);
        },
        renderQueries: function(cj, base, docs) {
            var query = {};
            query = {};
            query.rel = 'search';
            query.prompt = 'Search';
            query.href = base + '/api/' + url + '/search';
            query.data = [{
                'name': 'search',
                'value': '',
                'prompt': 'Search Criteria'
            }, {
                'name': 'searchBy',
                'value': values,
                'prompt': 'Search By'
            }];
            cj.collection.queries.push(query);
        },
        renderTemplate: function(cj, docs) {
            var item = {};
            var concatValues = [];
            if(hidden) {
                concatValues = values.concat(hidden);
            } else {
                concatValues = values;
            }
            for(var i = 0; i < concatValues.length; i++) {
                if(concatValues[i] == 'friends') {
                    item = {
                        'name': concatValues[i],
                        'value': [{
                            'user': '',
                            'mutual': '',
                            'userID': ''
                        }],
                        'prompt': concatValues[i]
                    }
                } else {
                    item = {
                        'name': concatValues[i],
                        'value': '',
                        'prompt': concatValues[i]
                    }
                }
                cj.collection.template.data.push(item);
            }
        }
    };
}