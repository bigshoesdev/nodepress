"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _articles = _interopRequireDefault(require("../models/articles"));

var _category = _interopRequireDefault(require("../models/category"));

var _settings = _interopRequireDefault(require("../models/settings"));

var _comment = _interopRequireDefault(require("../models/comment"));

var _tags = _interopRequireDefault(require("../models/tags"));

var _expressFlash = _interopRequireDefault(require("express-flash"));

var _moment = _interopRequireDefault(require("moment"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _users = _interopRequireDefault(require("../models/users"));

var _url = _interopRequireDefault(require("url"));

var _ads = _interopRequireDefault(require("../models/ads"));

var _install = _interopRequireDefault(require("../helpers/install"));

var _menu = _interopRequireDefault(require("../models/menu"));

var fs = require('fs');

var router = _express["default"].Router();

var SitemapGenerator = require('sitemap-generator'); // drowningsummer.228@gmail.com


_dotenv["default"].config({
  path: './.env'
});

router.use((0, _expressFlash["default"])());
router.use( /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var settingsInfo;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _settings["default"].find({});

          case 2:
            settingsInfo = _context.sent;
            _context.next = 5;
            return _menu["default"].find().sort({
              position: 1
            });

          case 5:
            res.locals.mainMenu = _context.sent;
            _context.next = 8;
            return _category["default"].find({}).sort({
              name: 1
            });

          case 8:
            res.locals.footercategory = _context.sent;

            res.locals.time = function (ev) {
              var wordsPerMinute = 250; // Average case.

              var result;
              var textLength = ev.split(/\s/g).length; // Split by words

              if (textLength > 0) {
                var value = Math.ceil(textLength / wordsPerMinute);
                result = "".concat(value, " min read");
              }

              return result;
            };

            res.locals.getmonth = function (data) {
              switch (data) {
                case 0:
                  return 'Jan';
                  break;

                case 1:
                  return 'Feb';
                  break;

                case 2:
                  return 'March';
                  break;

                case 3:
                  return 'Apr';
                  break;

                case 4:
                  return 'May';
                  break;

                case 5:
                  return 'Jun';
                  break;

                case 6:
                  return 'Jul';
                  break;

                case 7:
                  return 'Aug';
                  break;

                case 8:
                  return 'Sep';
                  break;

                case 9:
                  return 'Oct';
                  break;

                case 10:
                  return 'Nov';
                  break;

                case 11:
                  return 'Dec';
                  break;

                default:
                  break;
              }
            };

            res.locals.success_msg = req.flash('success_msg');
            res.locals.error_msg = req.flash('error_msg');
            res.locals.error = req.flash('error');
            res.locals.user = req.user || null;
            res.locals.siteTitle = settingsInfo == '' ? 'Pls edit site title in the admin dashboard' : typeof settingsInfo[0].siteName == 'undefined' ? 'Pls edit site title in the admin dashboard' : "".concat(settingsInfo[0].siteName);
            res.locals.siteDescription = settingsInfo == '' ? 'Edit site description in the admin dashboard' : typeof settingsInfo[0].siteDescription == 'undefined' ? 'edit site title in the admin dashboard' : "".concat(settingsInfo[0].siteDescription);
            _context.next = 19;
            return _articles["default"].find({
              slug: {
                $ne: _url["default"].parse(req.url).path.split('/').pop()
              }
            }).populate('category').populate('postedBy').sort({
              createdAt: -1
            }).limit(5);

          case 19:
            res.locals.recent = _context.sent;
            _context.next = 22;
            return _articles["default"].find({
              slug: {
                $ne: _url["default"].parse(req.url).path.split('/').pop()
              }
            }).populate('category').populate('postedBy').sort({
              views: -1
            }).limit(5);

          case 22:
            res.locals.sidebarPop = _context.sent;
            _context.next = 25;
            return _comment["default"].aggregate([{
              $lookup: {
                from: 'articles',
                localField: 'articleId',
                foreignField: '_id',
                as: 'article'
              }
            }, {
              $unwind: {
                path: '$article',
                preserveNullAndEmptyArrays: true
              }
            }, {
              $lookup: {
                from: 'users',
                localField: 'article.postedBy',
                foreignField: '_id',
                as: 'postedBy'
              }
            }, {
              $unwind: {
                path: '$postedBy',
                preserveNullAndEmptyArrays: true
              }
            }, {
              $lookup: {
                from: 'categories',
                localField: 'article.category',
                foreignField: '_id',
                as: 'category'
              }
            }, {
              $unwind: {
                path: '$category',
                preserveNullAndEmptyArrays: true
              }
            }, {
              $sort: {
                createdAt: -1
              }
            }, {
              $limit: 5
            }]);

          case 25:
            res.locals.comments = _context.sent;
            _context.next = 28;
            return _tags["default"].find().sort({
              createdAt: -1
            }).limit(12);

          case 28:
            res.locals.tags = _context.sent;
            _context.next = 31;
            return _tags["default"].find().sort({
              createdAt: -1
            });

          case 31:
            res.locals.tags2 = _context.sent;
            _context.next = 34;
            return _category["default"].aggregate([{
              $sort: {
                createdAt: -1
              }
            }, {
              $limit: 7
            }, {
              $lookup: {
                from: 'articles',
                localField: '_id',
                foreignField: 'category',
                as: 'total'
              }
            }]);

          case 34:
            res.locals.category = _context.sent;
            _context.next = 37;
            return _category["default"].aggregate([{
              $limit: 7
            }, {
              $lookup: {
                from: 'articles',
                localField: '_id',
                foreignField: 'category',
                as: 'total'
              }
            }, {
              $sort: {
                total: -1
              }
            }]);

          case 37:
            res.locals.hotCategory = _context.sent;
            _context.next = 40;
            return _category["default"].aggregate([{
              $sort: {
                name: 1
              }
            }, {
              $lookup: {
                from: 'articles',
                localField: '_id',
                foreignField: 'category',
                as: 'total'
              }
            }]);

          case 40:
            res.locals.category2 = _context.sent;
            _context.next = 43;
            return _category["default"].aggregate([{
              $match: {
                parent: {
                  $exists: false
                }
              }
            }, {
              $sort: {
                createdAt: -1
              }
            }]);

          case 43:
            res.locals.subCategory2 = _context.sent;
            _context.next = 46;
            return _category["default"].aggregate([{
              $match: {
                parent: {
                  $exists: true
                }
              }
            }, {
              $sort: {
                createdAt: -1
              }
            }]);

          case 46:
            res.locals.subCategory = _context.sent;

            res.locals.formatDate = function (arg) {
              return (0, _moment["default"])(arg).fromNow();
            };

            res.locals.strip = function (stringWithHTML) {
              var text = stringWithHTML.replace(/<!--[\s\S]*?(-->|$)/g, '').replace(/<(script|style)[^>]*>[\s\S]*?(<\/\1>|$)/gi, '').replace(/<\/?[a-z][\s\S]*?(>|$)/gi, '');
              return text;
            };

            res.locals.siteLink = "https://".concat(req.headers.host);
            res.locals.facebook = settingsInfo == '' ? 'https://facebook.com' : typeof settingsInfo[0].socialMedia.facebook == 'undefined' ? 'https://facebook.com' : "".concat(settingsInfo[0].socialMedia.facebook);
            res.locals.twitter = settingsInfo == '' ? 'https://twitter.com' : typeof settingsInfo[0].socialMedia.twitter == 'undefined' ? 'https://twitter.com' : "".concat(settingsInfo[0].socialMedia.twitter);
            res.locals.instagram = settingsInfo == '' ? 'https://instagram.com' : typeof settingsInfo[0].socialMedia.instagram == 'undefined' ? 'https://instagram.com' : "".concat(settingsInfo[0].socialMedia.instagram);
            res.locals.linkedin = settingsInfo == '' ? 'https://linkedin.com' : typeof settingsInfo[0].socialMedia.linkedin == 'undefined' ? 'https://linkedin.com' : "".concat(settingsInfo[0].socialMedia.linkedin);
            res.locals.youtube = settingsInfo == '' ? 'https://youtube.com' : typeof settingsInfo[0].socialMedia.youtube == 'undefined' ? 'https://youtube.com' : "".concat(settingsInfo[0].socialMedia.youtube);
            res.locals.pinterest = settingsInfo == '' ? 'https://pinterest.com' : typeof settingsInfo[0].socialMedia.pinterest == 'undefined' ? 'https://pinterest.com' : "".concat(settingsInfo[0].socialMedia.pinterest);
            res.locals.textAsIcon = settingsInfo == '' ? false : settingsInfo[0].textAsIcon;
            res.locals.siteLogo = settingsInfo == '' ? 'default.png' : typeof settingsInfo[0].siteLogo == 'undefined' ? 'default.png' : settingsInfo[0].siteLogo;
            res.locals.favicon = settingsInfo == '' ? 'default.png' : typeof settingsInfo[0].favicon == 'undefined' ? 'default.png' : settingsInfo[0].favicon;
            res.locals.siteEmail = settingsInfo == '' ? 'update site email in the admin dashboard' : typeof settingsInfo[0].contactInfo.email == 'undefined' ? 'update site email in the admin dashboard' : settingsInfo[0].contactInfo.email;
            res.locals.siteNumber = settingsInfo == '' ? 'update Phone number in the admin dashboard' : typeof settingsInfo[0].contactInfo.phoneNumber == 'undefined' ? 'update phone number in the admin dashboard' : settingsInfo[0].contactInfo.phoneNumber;
            res.locals.otherInfo = settingsInfo == '' ? 'update this in the admin dashboard' : typeof settingsInfo[0].contactInfo.otherInfo == 'undefined' ? 'update this in the admin dashboard' : settingsInfo[0].contactInfo.otherInfo;
            _context.next = 64;
            return _category["default"].find().populate('parent').sort({
              createdAt: -1
            }).limit(3);

          case 64:
            res.locals.headerCategory = _context.sent;
            res.locals.operatingSystem = process.platform;

            if (!(typeof req.user !== 'undefined')) {
              _context.next = 72;
              break;
            }

            _context.next = 69;
            return _articles["default"].countDocuments({
              postedBy: req.user.id
            });

          case 69:
            _context.t0 = _context.sent;
            _context.next = 73;
            break;

          case 72:
            _context.t0 = null;

          case 73:
            res.locals.myPost = _context.t0;
            res.locals.copyright = settingsInfo == '' ? "Copright ".concat(new Date().getFullYear()) : settingsInfo[0].copyright;
            res.locals.mainSettings = settingsInfo[0];
            _context.next = 78;
            return _ads["default"].find({
              location: 'homepageFooter'
            }).sort({
              createdAt: -1
            });

          case 78:
            res.locals.homepageFooter = _context.sent;
            _context.next = 81;
            return _ads["default"].find({
              location: 'homepageSidebar'
            }).sort({
              createdAt: -1
            });

          case 81:
            res.locals.homepageSidebar = _context.sent;
            _context.next = 84;
            return _ads["default"].find({
              location: 'categoryFooter'
            }).sort({
              createdAt: -1
            });

          case 84:
            res.locals.categoryFooter = _context.sent;
            _context.next = 87;
            return _ads["default"].find({
              location: 'authorFooter'
            }).sort({
              createdAt: -1
            });

          case 87:
            res.locals.authorFooter = _context.sent;
            _context.next = 90;
            return _ads["default"].find({
              location: 'searchFooter'
            }).sort({
              createdAt: -1
            });

          case 90:
            res.locals.searchFooter = _context.sent;

            res.locals.getCat = function (arg) {
              var promise = new Promise(function (resolve, reject) {
                resolve(_category["default"].findOne({
                  slug: arg.split('/').pop()
                }));
              });
              return promise.then(function (data) {
                return data.name;
              });
            };

            next();

          case 93:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}()); // Disable post request in the demo
// router.post('*', (req, res, next) => {
// 	if (req.path == '/login') {
// 		return next();
// 	} else {
// 		req.flash('success_msg', 'Post request is disabled in demo');
// 		return res.redirect('back');
// 	}
// });

router.get('/publisher', _install["default"].redirectToLogin, /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            res.render('publisher', {
              title: "Publisher"
            });

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}());
router.get('/sitemap.xml', _install["default"].redirectToLogin, /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            fs.readFile('./survey.xml', function (err, data) {
              console.log(data);
            });

          case 1:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}());
router.get('/lostpassword', _install["default"].redirectToLogin, /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            res.render('lostpassword', {
              title: "Lost Passowrd"
            });

          case 1:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function (_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}());
router.get('/paycontent', _install["default"].redirectToLogin, /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            res.render('paycontent', {
              title: "Pay Content"
            });

          case 1:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function (_x13, _x14, _x15) {
    return _ref5.apply(this, arguments);
  };
}());
router.get('/blogrecent', _install["default"].redirectToLogin, /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res, next) {
    var userId, user, editorsPicker, article, category, usercategoryList, categories, trendings, followers, authorarticle, i, art, j, newest, random, favorites, total_article;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            userId = req.user._id;
            _context6.next = 3;
            return _users["default"].findOne({
              _id: userId
            });

          case 3:
            user = _context6.sent;
            _context6.next = 6;
            return _articles["default"].find({
              addToBreaking: true
            }).populate('category').populate('postedBy').sort('create_at').limit(3);

          case 6:
            editorsPicker = _context6.sent;
            _context6.next = 9;
            return _articles["default"].find({
              addToBreaking: true
            }).populate('category').populate('postedBy').sort('create_at');

          case 9:
            article = _context6.sent;
            editorsPicker.push(article);
            _context6.next = 13;
            return _category["default"].find({});

          case 13:
            category = _context6.sent;
            usercategoryList = user.categoryList;
            categories = [];
            category.forEach(function (element) {
              usercategoryList.forEach(function (item) {
                if (item == element.slug) {
                  categories.push(element);
                }
              });
            });
            _context6.next = 19;
            return _articles["default"].find({}).populate('category').populate('postedBy').sort({
              views: -1
            }).limit(5);

          case 19:
            trendings = _context6.sent;
            _context6.next = 22;
            return _users["default"].find({
              following: {
                $in: req.user.id
              }
            }).populate("following").sort({
              createdAt: -1
            });

          case 22:
            followers = _context6.sent;
            authorarticle = [];
            _context6.t0 = _regenerator["default"].keys(followers);

          case 25:
            if ((_context6.t1 = _context6.t0()).done) {
              _context6.next = 33;
              break;
            }

            i = _context6.t1.value;
            _context6.next = 29;
            return _articles["default"].find({
              postedBy: followers[i]._id
            }).populate('category').populate('postedBy').sort({
              createdAt: -1
            });

          case 29:
            art = _context6.sent;

            for (j in art) {
              authorarticle.push(art[j]);
            }

            _context6.next = 25;
            break;

          case 33:
            _context6.next = 35;
            return _articles["default"].find({}).sort({
              createdAt: -1
            }).populate('category').populate('postedBy').limit(3);

          case 35:
            newest = _context6.sent;
            _context6.next = 38;
            return _articles["default"].find({}).populate('category').populate('postedBy').limit(6);

          case 38:
            random = _context6.sent;
            favorites = [];
            _context6.next = 42;
            return _articles["default"].find({}).populate('category').populate('postedBy').sort('create_at').limit(10);

          case 42:
            total_article = _context6.sent;
            categories.forEach(function (element) {
              total_article.forEach(function (item) {
                if (item.category.slug == element.slug) {
                  favorites.push(item);
                }
              });
            });
            res.render('blogrecent', {
              title: 'Blog recent',
              editorsPicker: editorsPicker,
              categories: categories,
              trendings: trendings,
              authorarticle: authorarticle,
              newest: newest,
              random: random,
              favorites: favorites
            });

          case 45:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function (_x16, _x17, _x18) {
    return _ref6.apply(this, arguments);
  };
}());
router.get('/ourwork', /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res, next) {
    var userId, user, category, usercategoryList, categories, favorites, total_article;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            userId = req.user._id;
            _context7.next = 3;
            return _users["default"].findOne({
              _id: userId
            });

          case 3:
            user = _context7.sent;
            _context7.next = 6;
            return _category["default"].find({});

          case 6:
            category = _context7.sent;
            usercategoryList = user.categoryList;
            categories = [];
            category.forEach(function (element) {
              usercategoryList.forEach(function (item) {
                if (item == element.slug) {
                  categories.push(element);
                }
              });
            });
            favorites = [];
            _context7.next = 13;
            return _articles["default"].find({}).populate('category').populate('postedBy').sort('create_at').limit(10);

          case 13:
            total_article = _context7.sent;
            categories.forEach(function (element) {
              total_article.forEach(function (item) {
                if (item.category.slug == element.slug) {
                  favorites.push(item);
                }
              });
            });
            res.render('ourwork', {
              title: "Our Work",
              favorites: favorites
            });

          case 16:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function (_x19, _x20, _x21) {
    return _ref7.apply(this, arguments);
  };
}()); // Get index page

router.get('/', _install["default"].redirectToLogin, /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res, next) {
    var perPage, page, slider1, featured, post, count, popularNews, popNews, img, recommended, breakingNews, video, categories;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.prev = 0;
            perPage = 9;
            page = req.query.page || 1;
            _context8.next = 5;
            return _articles["default"].aggregate([{
              $match: {
                showPostOnSlider: true,
                active: true
              }
            }, {
              $lookup: {
                from: 'categories',
                localField: 'category',
                foreignField: '_id',
                as: 'category'
              }
            }, {
              $unwind: {
                path: '$category',
                preserveNullAndEmptyArrays: true
              }
            }, {
              $lookup: {
                from: 'users',
                localField: 'postedBy',
                foreignField: '_id',
                as: 'postedBy'
              }
            }, {
              $unwind: {
                path: '$postedBy',
                preserveNullAndEmptyArrays: true
              }
            }, {
              $lookup: {
                from: 'comments',
                localField: '_id',
                foreignField: 'articleId',
                as: 'comments'
              }
            }, {
              $sort: {
                createdAt: -1
              }
            }, {
              $limit: 4
            }]);

          case 5:
            slider1 = _context8.sent;
            _context8.next = 8;
            return _articles["default"].aggregate([{
              $match: {
                addToFeatured: true,
                active: true
              }
            }, {
              $lookup: {
                from: 'categories',
                localField: 'category',
                foreignField: '_id',
                as: 'category'
              }
            }, {
              $unwind: {
                path: '$category',
                preserveNullAndEmptyArrays: true
              }
            }, {
              $lookup: {
                from: 'users',
                localField: 'postedBy',
                foreignField: '_id',
                as: 'postedBy'
              }
            }, {
              $unwind: {
                path: '$postedBy',
                preserveNullAndEmptyArrays: true
              }
            }, {
              $lookup: {
                from: 'comments',
                localField: '_id',
                foreignField: 'articleId',
                as: 'comments'
              }
            }, {
              $sort: {
                createdAt: -1
              }
            }, {
              $limit: 4
            }]);

          case 8:
            featured = _context8.sent;
            _context8.next = 11;
            return _articles["default"].find({
              active: true
            }).populate('postedBy').populate('category').sort({
              createdAt: -1
            }).skip(perPage * page - perPage).limit(perPage);

          case 11:
            post = _context8.sent;
            _context8.next = 14;
            return _articles["default"].countDocuments({
              active: true
            });

          case 14:
            count = _context8.sent;
            _context8.next = 17;
            return _articles["default"].find({
              active: true
            }).sort({
              views: -1
            }).populate('category').populate('postedBy').limit(1);

          case 17:
            popularNews = _context8.sent;
            _context8.next = 20;
            return _articles["default"].find({
              active: true
            }).sort({
              views: -1
            }).populate('category').limit(3);

          case 20:
            popNews = _context8.sent;
            _context8.next = 23;
            return _articles["default"].find({
              active: true
            }).sort({
              createdAt: -1
            }).limit(12);

          case 23:
            img = _context8.sent;
            _context8.next = 26;
            return _articles["default"].find({
              active: true,
              addToRecommended: true
            }).populate('category').populate('postedBy').sort({
              createdAt: -1
            }).limit(4);

          case 26:
            recommended = _context8.sent;
            _context8.next = 29;
            return _articles["default"].find({
              active: true,
              addToBreaking: true
            }).populate('category').populate('postedBy').sort({
              createdAt: -1
            }).limit(4);

          case 29:
            breakingNews = _context8.sent;
            _context8.next = 32;
            return _articles["default"].aggregate([{
              $match: {
                postType: 'video',
                active: true
              }
            }, {
              $lookup: {
                from: 'categories',
                localField: 'category',
                foreignField: '_id',
                as: 'category'
              }
            }, {
              $unwind: {
                path: '$category',
                preserveNullAndEmptyArrays: true
              }
            }, {
              $lookup: {
                from: 'users',
                localField: 'postedBy',
                foreignField: '_id',
                as: 'postedBy'
              }
            }, {
              $unwind: {
                path: '$postedBy',
                preserveNullAndEmptyArrays: true
              }
            }, {
              $lookup: {
                from: 'comments',
                localField: '_id',
                foreignField: 'articleId',
                as: 'comments'
              }
            }, {
              $sort: {
                createdAt: -1
              }
            }, {
              $limit: 12
            }]);

          case 32:
            video = _context8.sent;
            _context8.next = 35;
            return _category["default"].find({});

          case 35:
            categories = _context8.sent;
            res.render('index', {
              categories: categories,
              post: post,
              current: page,
              pages: Math.ceil(count / perPage),
              slider1: slider1,
              popular: popularNews[0],
              popNews: popNews,
              img: img,
              breakingNews: breakingNews,
              featured: featured,
              video: video,
              recommended: recommended
            });
            _context8.next = 42;
            break;

          case 39:
            _context8.prev = 39;
            _context8.t0 = _context8["catch"](0);
            next(_context8.t0);

          case 42:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[0, 39]]);
  }));

  return function (_x22, _x23, _x24) {
    return _ref8.apply(this, arguments);
  };
}()); // Get search page

router.get('/search', _install["default"].redirectToLogin, /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(req, res, next) {
    var perPage, page, count, data, datacategory, datauser, random, popular;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.prev = 0;

            if (!req.query.q) {
              _context9.next = 26;
              break;
            }

            perPage = 3;
            page = req.query.page || 1;
            _context9.next = 6;
            return _articles["default"].countDocuments({
              active: true,
              $or: [{
                title: {
                  $regex: req.query.q,
                  $options: '$i'
                }
              }, {
                tags: {
                  $regex: req.query.q,
                  $options: '$i'
                }
              }]
            });

          case 6:
            count = _context9.sent;
            _context9.next = 9;
            return _articles["default"].find({
              active: true,
              $or: [{
                title: {
                  $regex: req.query.q,
                  $options: '$i'
                }
              }, {
                tags: {
                  $regex: req.query.q,
                  $options: '$i'
                }
              }]
            }).populate('postedBy').populate('category').skip(perPage * page - perPage).limit(perPage).sort({
              createdAt: -1
            });

          case 9:
            data = _context9.sent;
            _context9.next = 12;
            return _category["default"].find({
              name: {
                $regex: req.query.q,
                $options: '$i'
              }
            }).skip(perPage * page - perPage).limit(perPage).sort({
              createdAt: -1
            });

          case 12:
            datacategory = _context9.sent;
            _context9.next = 15;
            return _users["default"].find({
              active: true,
              username: {
                $regex: req.query.q,
                $options: '$i'
              }
            }).skip(perPage * page - perPage).limit(perPage).sort({
              createdAt: -1
            });

          case 15:
            datauser = _context9.sent;
            _context9.next = 18;
            return _articles["default"].aggregate([{
              $match: {
                active: true
              }
            }, {
              $sample: {
                size: 4
              }
            }, {
              $lookup: {
                from: 'users',
                localField: 'postedBy',
                foreignField: '_id',
                as: 'postedBy'
              }
            }, {
              $unwind: '$postedBy'
            }, {
              $lookup: {
                from: 'categories',
                localField: 'category',
                foreignField: '_id',
                as: 'category'
              }
            }, {
              $unwind: '$category'
            }]);

          case 18:
            random = _context9.sent;
            _context9.next = 21;
            return _articles["default"].find({}).populate("category").populate("postedBy").sort({
              views: -1
            }).limit(3);

          case 21:
            popular = _context9.sent;
            console.log(datacategory.length);
            res.render('search', {
              data: data,
              datacategory: datacategory,
              datauser: datauser,
              search: req.query.q,
              current: page,
              pages: Math.ceil(count / perPage),
              random: random,
              popular: popular
            });
            _context9.next = 27;
            break;

          case 26:
            res.render('404');

          case 27:
            _context9.next = 32;
            break;

          case 29:
            _context9.prev = 29;
            _context9.t0 = _context9["catch"](0);
            next(_context9.t0);

          case 32:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, null, [[0, 29]]);
  }));

  return function (_x25, _x26, _x27) {
    return _ref9.apply(this, arguments);
  };
}());
router.get('/author/:usernameslug', _install["default"].redirectToLogin, /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(req, res, next) {
    var users, user, featured, perPage, page, article, count;
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.next = 2;
            return _users["default"].find({});

          case 2:
            users = _context11.sent;
            users.forEach( /*#__PURE__*/function () {
              var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(element) {
                var username, array, usernameslug;
                return _regenerator["default"].wrap(function _callee10$(_context10) {
                  while (1) {
                    switch (_context10.prev = _context10.next) {
                      case 0:
                        username = element.username.toLowerCase();
                        array = username.split('');
                        array.forEach(function (item, index) {
                          if (item == "ß") {
                            array[index] = "ss";
                          }

                          if (item == "ö") {
                            array[index] = "oe";
                          }

                          if (item == "ä") {
                            array[index] = "ae";
                          }

                          if (item == "ü") {
                            array[index] = "ue";
                          }
                        });
                        usernameslug = array.join("");
                        _context10.next = 6;
                        return _users["default"].updateOne({
                          _id: element._id
                        }, {
                          usernameslug: usernameslug
                        });

                      case 6:
                      case "end":
                        return _context10.stop();
                    }
                  }
                }, _callee10);
              }));

              return function (_x31) {
                return _ref11.apply(this, arguments);
              };
            }());
            _context11.next = 6;
            return _users["default"].findOne({
              usernameslug: req.params.usernameslug
            });

          case 6:
            user = _context11.sent;
            _context11.next = 9;
            return _articles["default"].aggregate([{
              $match: {
                addToFeatured: true,
                active: true
              }
            }, {
              $lookup: {
                from: 'categories',
                localField: 'category',
                foreignField: '_id',
                as: 'category'
              }
            }, {
              $unwind: {
                path: '$category',
                preserveNullAndEmptyArrays: true
              }
            }, {
              $lookup: {
                from: 'users',
                localField: 'postedBy',
                foreignField: '_id',
                as: 'postedBy'
              }
            }, {
              $unwind: {
                path: '$postedBy',
                preserveNullAndEmptyArrays: true
              }
            }, {
              $lookup: {
                from: 'comments',
                localField: '_id',
                foreignField: 'articleId',
                as: 'comments'
              }
            }, {
              $sort: {
                createdAt: -1
              }
            }, {
              $limit: 4
            }]);

          case 9:
            featured = _context11.sent;

            if (user) {
              _context11.next = 14;
              break;
            }

            res.render('404');
            _context11.next = 23;
            break;

          case 14:
            perPage = 9;
            page = req.query.page || 1;
            _context11.next = 18;
            return _articles["default"].find({
              active: true,
              postedBy: user._id
            }).populate('postedBy').populate('category').skip(perPage * page - perPage).limit(perPage).sort({
              createdAt: -1
            });

          case 18:
            article = _context11.sent;
            _context11.next = 21;
            return _articles["default"].countDocuments({
              active: true,
              postedBy: user._id
            });

          case 21:
            count = _context11.sent;
            res.render('author', {
              author: user,
              article: article,
              featured: featured,
              current: page,
              pages: Math.ceil(count / perPage)
            });

          case 23:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11);
  }));

  return function (_x28, _x29, _x30) {
    return _ref10.apply(this, arguments);
  };
}());
router.get('/vision', _install["default"].redirectToLogin, /*#__PURE__*/function () {
  var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(req, res, next) {
    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            res.render('vision');

          case 1:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12);
  }));

  return function (_x32, _x33, _x34) {
    return _ref12.apply(this, arguments);
  };
}());
router.get('/membership', _install["default"].redirectToLogin, /*#__PURE__*/function () {
  var _ref13 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(req, res, next) {
    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            res.render('membership');

          case 1:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13);
  }));

  return function (_x35, _x36, _x37) {
    return _ref13.apply(this, arguments);
  };
}());
module.exports = router;