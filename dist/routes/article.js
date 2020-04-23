"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _users = _interopRequireDefault(require("../models/users"));

var _articles = _interopRequireDefault(require("../models/articles"));

var _category = _interopRequireDefault(require("../models/category"));

var _comment = _interopRequireDefault(require("../models/comment"));

var _settings = _interopRequireDefault(require("../models/settings"));

var _auth = _interopRequireDefault(require("../helpers/auth"));

var _htmlToText = _interopRequireDefault(require("html-to-text"));

var _install = _interopRequireDefault(require("../helpers/install"));

var _flag = _interopRequireDefault(require("../models/flag"));

var _bookmark = _interopRequireDefault(require("../models/bookmark"));

var router = _express["default"].Router(); // Create a new article


router.post("/article/create", _install["default"].redirectToLogin, _auth["default"], /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var search, slug, content, textLength, set, newDate, months, errors, payload1, errors2, payload, errors3, payload2;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _articles["default"].find({
              title: req.body.title
            });

          case 2:
            search = _context.sent;
            _context.next = 5;
            return _articles["default"].findOne({
              slug: req.body.slug
            });

          case 5:
            slug = _context.sent;
            content = req.body.body;
            textLength = content.split(/\s/g).length;
            _context.next = 10;
            return _settings["default"].findOne();

          case 10:
            set = _context.sent;

            Date.prototype.getWeek = function () {
              var dt = new Date(this.getFullYear(), 0, 1);
              return Math.ceil(((this - dt) / 86400000 + dt.getDay() + 1) / 7);
            };

            newDate = new Date(); //List months cos js months starts from zero to 11

            months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            _context.prev = 14;
            _context.t0 = req.body.postType;
            _context.next = _context.t0 === "post" ? 18 : _context.t0 === "audio" ? 34 : _context.t0 === "video" ? 47 : 60;
            break;

          case 18:
            req.assert("title", "Title Field cannot be left blank").notEmpty();
            req.assert("category", "Please select a category").notEmpty();
            errors = req.validationErrors();

            if (!errors) {
              _context.next = 24;
              break;
            }

            req.flash("success_msg", "".concat(errors[0].msg));
            return _context.abrupt("return", res.redirect("back"));

          case 24:
            if (!slug) {
              _context.next = 27;
              break;
            }

            req.flash("success_msg", "That slug has been used, pls used another slug or just leave the field empty");
            return _context.abrupt("return", res.redirect("back"));

          case 27:
            if (!(textLength < 200)) {
              _context.next = 30;
              break;
            }

            req.flash("success_msg", "Das sieht doch garnicht mal so schlecht aus! Dennoch solltest du mindestens 200 Wörter schreiben, um deinen Lesern einen Mehrwert zu bieten");
            return _context.abrupt("return", res.redirect("back"));

          case 30:
            payload1 = {
              week: "".concat(newDate.getWeek()),
              month: "".concat(months[newDate.getMonth()]),
              year: "".concat(newDate.getFullYear()),
              title: req.body.title.trim(),
              metatitle: req.body.metatitle,
              metadescription: req.body.metadescription,
              body: req.body.body.trim(),
              summary: req.body.summary.trim(),
              keywords: req.body.keywords.trim(),
              "short": _htmlToText["default"].fromString(req.body.body, {
                wordwrap: false
              }),
              slug: req.body.slug ? req.body.slug.trim().toLowerCase().split("?").join("").split(" ").join("-").replace(new RegExp("/", "g"), "-") : search !== "" ? req.body.title.trim().toLowerCase().split("?").join("").split(" ").join("-").replace(new RegExp("/", "g"), "-") + "-" + search.length : req.body.title.trim().toLowerCase().split("?").join("").split(" ").join("-").replace(new RegExp("/", "g"), "-"),
              tags: !req.body.tags ? undefined : req.body.tags.split(","),
              category: req.body.category,
              subCategory: req.body.subCategory,
              file: req.body.file,
              postedBy: req.user.id,
              postType: req.body.postType,
              showPostOnSlider: !req.body.showPostOnSlider ? false : req.body.showPostOnSlider ? true : false,
              addToNoIndex: !req.body.addToNoIndex ? false : req.body.addToNoIndex ? true : false,
              addToFeatured: !req.body.addToFeatured ? false : req.body.addToFeatured ? true : false,
              addToBreaking: !req.body.addToBreaking ? true : req.body.addToBreaking ? true : false,
              addToRecommended: !req.body.addToRecommended ? false : true,
              showOnlyToRegisteredUsers: !req.body.showOnlyToRegisteredUsers ? false : true
            };

            if (req.user.roleId == "admin") {
              payload1.active = !req.body.status ? true : req.body.status == "activate" ? true : false;
            } else {
              payload1.active = set.approveAddedUserPost == false ? false : true;
            }

            _articles["default"].create(payload1).then(function (created) {
              req.flash("success_msg", "New article has been posted successfully");
              return res.redirect("back");
            })["catch"](function (e) {
              return next(e);
            });

            return _context.abrupt("break", 61);

          case 34:
            req.assert("title", "Title Field cannot be left blank").notEmpty();
            req.assert("category", "Please select a category").notEmpty();
            errors2 = req.validationErrors();

            if (!errors2) {
              _context.next = 40;
              break;
            }

            req.flash("success_msg", "".concat(errors2[0].msg));
            return _context.abrupt("return", res.redirect("back"));

          case 40:
            if (!slug) {
              _context.next = 43;
              break;
            }

            req.flash("success_msg", "That slug has been used, pls used another slug or just leave the field empty");
            return _context.abrupt("return", res.redirect("back"));

          case 43:
            payload = {
              week: "".concat(newDate.getWeek()),
              month: "".concat(months[newDate.getMonth()]),
              year: "".concat(newDate.getFullYear()),
              title: req.body.title.trim(),
              body: req.body.body.trim(),
              summary: req.body.summary.trim(),
              keywords: req.body.keywords.trim(),
              "short": _htmlToText["default"].fromString(req.body.body, {
                wordwrap: false
              }),
              slug: req.body.slug ? req.body.slug.trim().toLowerCase().split("?").join("").split(" ").join("-").replace(new RegExp("/", "g"), "-") : search !== "" ? req.body.title.trim().toLowerCase().split("?").join("").split(" ").join("-").replace(new RegExp("/", "g"), "-") + "-" + search.length : req.body.title.trim().toLowerCase().split("?").join("").split(" ").join("-").replace(new RegExp("/", "g"), "-"),
              tags: !req.body.tags ? undefined : req.body.tags.split(","),
              category: req.body.category,
              subCategory: req.body.subCategory,
              file: req.body.file,
              postedBy: req.user.id,
              postType: req.body.postType,
              active: !req.body.status ? true : req.body.status == "activate" ? true : false,
              showPostOnSlider: !req.body.showPostOnSlider ? true : req.body.showPostOnSlider ? true : false,
              addToFeatured: !req.body.addToFeatured ? false : req.body.addToFeatured ? true : false,
              addToBreaking: !req.body.addToBreaking ? true : req.body.addToBreaking ? true : false,
              addToRecommended: !req.body.addToRecommended ? false : true,
              showOnlyToRegisteredUsers: !req.body.showOnlyToRegisteredUsers ? false : true,
              audioFile: req.body.audioFile,
              download: req.body.download ? true : false
            };

            if (req.user.roleId == "admin") {
              payload.active = !req.body.status ? true : req.body.status == "activate" ? true : false;
            } else {
              payload.active = set.approveAddedUserPost == false ? false : true;
            }

            _articles["default"].create(payload).then(function (created) {
              req.flash("success_msg", "New Audio has been posted successfully");
              return res.redirect("back");
            })["catch"](function (e) {
              return next(e);
            });

            return _context.abrupt("break", 61);

          case 47:
            req.assert("title", "Title Field cannot be left blank").notEmpty();
            req.assert("category", "Please select a category").notEmpty();
            errors3 = req.validationErrors();

            if (!errors3) {
              _context.next = 53;
              break;
            }

            req.flash("success_msg", "".concat(errors3[0].msg));
            return _context.abrupt("return", res.redirect("back"));

          case 53:
            if (!slug) {
              _context.next = 56;
              break;
            }

            req.flash("success_msg", "That slug has been used, pls used another slug or just leave the field empty");
            return _context.abrupt("return", res.redirect("back"));

          case 56:
            payload2 = {
              week: "".concat(newDate.getWeek()),
              month: "".concat(months[newDate.getMonth()]),
              year: "".concat(newDate.getFullYear()),
              title: req.body.title.trim(),
              body: req.body.body.trim(),
              summary: req.body.summary.trim(),
              keywords: req.body.keywords.trim(),
              "short": _htmlToText["default"].fromString(req.body.body, {
                wordwrap: false
              }),
              slug: req.body.slug ? req.body.slug.trim().toLowerCase().split("?").join("").split(" ").join("-").replace(new RegExp("/", "g"), "-") : search !== "" ? req.body.title.trim().toLowerCase().split("?").join("").split(" ").join("-").replace(new RegExp("/", "g"), "-") + "-" + search.length : req.body.title.trim().toLowerCase().split("?").join("").split(" ").join("-").replace(new RegExp("/", "g"), "-"),
              tags: !req.body.tags ? undefined : req.body.tags.split(","),
              category: req.body.category,
              subCategory: req.body.subCategory,
              file: req.body.file,
              postedBy: req.user.id,
              postType: req.body.postType,
              active: !req.body.status ? true : req.body.status == "activate" ? true : false,
              showPostOnSlider: !req.body.showPostOnSlider ? true : req.body.showPostOnSlider ? true : false,
              addToFeatured: !req.body.addToFeatured ? false : req.body.addToFeatured ? true : false,
              addToBreaking: !req.body.addToBreaking ? true : req.body.addToBreaking ? true : false,
              addToRecommended: !req.body.addToRecommended ? false : true,
              showOnlyToRegisteredUsers: !req.body.showOnlyToRegisteredUsers ? false : true,
              videoFile: req.body.videoFile,
              videoType: req.body.videoType
            };

            if (req.user.roleId == "admin") {
              payload2.active = !req.body.status ? true : req.body.status == "activate" ? true : false;
            } else {
              payload2.active = set.approveAddedUserPost == false ? false : true;
            }

            _articles["default"].create(payload2).then(function (created) {
              req.flash("success_msg", "New Video has been posted successfully");
              return res.redirect("back");
            })["catch"](function (e) {
              return next(e);
            });

            return _context.abrupt("break", 61);

          case 60:
            return _context.abrupt("break", 61);

          case 61:
            _context.next = 66;
            break;

          case 63:
            _context.prev = 63;
            _context.t1 = _context["catch"](14);
            next(_context.t1);

          case 66:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[14, 63]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}()); // Edit an Article

router.post("/article/edit", _install["default"].redirectToLogin, _auth["default"], function (req, res, next) {
  try {
    var content = req.body.body;
    var textLength = content.split(/\s/g).length;

    if (textLength < 200) {
      req.flash("success_msg", "Das sieht doch garnicht mal so schlecht aus! Dennoch solltest du mindestens 200 Wörter schreiben, um deinen Lesern einen Mehrwert zu bieten");
      return res.redirect("back");
    }

    req.body.tags ? req.body.tags = req.body.tags.split(",") : undefined;
    req.body.showPostOnSlider = req.body.showPostOnSlider ? true : false;
    req.body.addToNoIndex = req.body.addToNoIndex ? true : false;
    req.body.addToFeatured = req.body.addToFeatured ? true : false;
    req.body.addToBreaking = req.body.addToBreaking ? true : false;
    req.body.addToRecommended = !req.body.addToRecommended ? false : true;
    req.body["short"] = _htmlToText["default"].fromString(req.body.body, {
      wordwrap: false
    });
    req.body.showOnlyToRegisteredUsers = !req.body.showOnlyToRegisteredUsers ? false : true;
    req.body.postType == "audio" ? req.body.download = req.body.download ? true : false : undefined;
    req.body.postType == "audio" ? req.body.audioFile = req.body.audioFile : undefined;
    req.body.slug = req.body.slug.trim().toLowerCase().split("?").join("").split(" ").join("-").replace(new RegExp("/", "g"), "-");

    if (req.user.roleId == "admin") {
      req.body.active = !req.body.status ? true : req.body.status == "activate" ? true : false;
    } else {
      // req.body.active = set.approveUpdatedUserPost == false ? false : true;
      req.body.active = true;
    }

    switch (req.body.postType) {
      case "post":
        _articles["default"].updateOne({
          _id: req.body.articleId.trim()
        }, req.body).then(function (updated) {
          req.flash("success_msg", "Article has been updated successfully");

          if (req.user.roleId == "admin") {
            return res.redirect("/dashboard/all-posts/edit/".concat(req.body.slug));
          } else {
            return res.redirect("/user/all-posts/edit/".concat(req.body.slug));
          }
        })["catch"](function (e) {
          return next(e);
        });

        break;

      case "audio":
        _articles["default"].updateOne({
          _id: req.body.articleId.trim()
        }, req.body).then(function (updated) {
          req.flash("success_msg", "Audio has been updated successfully");
          return res.redirect("/dashboard/all-posts/edit/".concat(req.body.slug));
        })["catch"](function (e) {
          return next(e);
        });

        break;

      case "video":
        _articles["default"].updateOne({
          _id: req.body.articleId.trim()
        }, req.body).then(function (updated) {
          req.flash("success_msg", "Video has been updated successfully");
          return res.redirect("/dashboard/all-posts/edit/".concat(req.body.slug));
        })["catch"](function (e) {
          return next(e);
        });

      default:
        false;
    }
  } catch (error) {
    next(error);
  }
}); // Delete an Article

router.post("/article/delete", _install["default"].redirectToLogin, _auth["default"], /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var article;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return _articles["default"].findById(req.body.articleId);

          case 3:
            article = _context2.sent;

            _comment["default"].deleteMany({
              slug: article.slug
            }).then(function (deleted) {
              _articles["default"].deleteOne({
                _id: req.body.articleId.trim()
              }).then(function (deleted) {
                req.flash("success_msg", "Article has been Deleted");
              })["catch"](function (e) {
                return next(e);
              });
            })["catch"](function (e) {
              return next(e);
            });

            _comment["default"].deleteMany({});

            _context2.next = 11;
            break;

          case 8:
            _context2.prev = 8;
            _context2.t0 = _context2["catch"](0);
            next(_context2.t0);

          case 11:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 8]]);
  }));

  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}()); // Delete Many Articles

router.post("/article/deletemany", _install["default"].redirectToLogin, _auth["default"], /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return _comment["default"].deleteMany({
              articleId: req.body.ids
            });

          case 3:
            _context3.next = 5;
            return _articles["default"].deleteMany({
              _id: req.body.ids
            });

          case 5:
            if (req.body.ids) {
              _context3.next = 10;
              break;
            }

            req.flash("success_msg", "Nothing Has Been Deleted");
            return _context3.abrupt("return", res.redirect('back'));

          case 10:
            req.flash("success_msg", "Posts Has Been Deleted");
            return _context3.abrupt("return", res.redirect('back'));

          case 12:
            _context3.next = 17;
            break;

          case 14:
            _context3.prev = 14;
            _context3.t0 = _context3["catch"](0);
            next(_context3.t0);

          case 17:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 14]]);
  }));

  return function (_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}()); // Activate Many Articles

router.post("/article/activateMany", _install["default"].redirectToLogin, _auth["default"], function (req, res, next) {
  try {
    _articles["default"].updateMany({
      _id: req.body.ids
    }, {
      $set: {
        active: true
      }
    }).then(function (deleted) {
      if (!req.body.ids) {
        req.flash("success_msg", "Nothing Has Been Updated");
        return res.redirect("/dashboard/all-posts");
      } else {
        req.flash("success_msg", "Articles Has Been Published");
        return res.redirect("/dashboard/all-posts");
      }
    })["catch"](function (e) {
      return next(e);
    });
  } catch (error) {
    next(error);
  }
}); // Deactivate Many Articles

router.post("/article/deactivateMany", _install["default"].redirectToLogin, _auth["default"], function (req, res, next) {
  try {
    _articles["default"].updateMany({
      _id: req.body.ids
    }, {
      $set: {
        active: false
      }
    }).then(function (deleted) {
      if (!req.body.ids) {
        req.flash("success_msg", "Nothing Has Been Updated");
        return res.redirect("/dashboard/all-posts");
      } else {
        req.flash("success_msg", "Articles Has Been Saved to Draft");
        return res.redirect("/dashboard/all-posts");
      }
    })["catch"](function (e) {
      return next(e);
    });
  } catch (error) {
    next(error);
  }
});
router.get("/p/:category/:slug", _install["default"].redirectToLogin, /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var settings, user, slug, category, article, bookmark, book, art, _next, previous, featured, popular, recommended, related, d, customDate, ips, articleCount, ip;

    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return _settings["default"].findOne();

          case 3:
            settings = _context4.sent;
            user = req.params.user;
            slug = req.params.slug;
            category = req.params.category;
            _context4.next = 9;
            return _articles["default"].aggregate([{
              $match: {
                active: true,
                slug: req.params.slug
              }
            }, {
              $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category"
              }
            }, {
              $unwind: {
                path: "$category",
                preserveNullAndEmptyArrays: true
              }
            }, {
              $lookup: {
                from: "categories",
                localField: "subCategory",
                foreignField: "_id",
                as: "subCategory"
              }
            }, {
              $unwind: {
                path: "$subCategory",
                preserveNullAndEmptyArrays: true
              }
            }, {
              $lookup: {
                from: "users",
                localField: "postedBy",
                foreignField: "_id",
                as: "postedBy"
              }
            }, {
              $unwind: {
                path: "$postedBy",
                preserveNullAndEmptyArrays: true
              }
            }, {
              $lookup: {
                from: "comments",
                "let": {
                  indicator_id: "$_id"
                },
                as: "comments",
                pipeline: [{
                  $match: {
                    $expr: {
                      $eq: ["$articleId", "$$indicator_id"]
                    },
                    active: true
                  }
                }, {
                  $sort: {
                    createdAt: -1
                  }
                }]
              }
            }]);

          case 9:
            article = _context4.sent;

            if (!(article == "")) {
              _context4.next = 14;
              break;
            }

            res.render("404");
            _context4.next = 66;
            break;

          case 14:
            if (!(typeof req.user !== "undefined")) {
              _context4.next = 20;
              break;
            }

            _context4.next = 17;
            return _bookmark["default"].findOne({
              userId: req.user.id,
              articleId: article[0]._id
            });

          case 17:
            _context4.t0 = _context4.sent;
            _context4.next = 21;
            break;

          case 20:
            _context4.t0 = false;

          case 21:
            bookmark = _context4.t0;
            book = bookmark ? true : false;
            _context4.next = 25;
            return _articles["default"].findOne({
              slug: req.params.slug,
              active: true
            });

          case 25:
            art = _context4.sent;
            _context4.next = 28;
            return _articles["default"].find({
              active: true,
              _id: {
                $gt: article[0]._id
              },
              category: article[0].category._id,
              postedBy: article[0].postedBy._id
            }).populate("category").populate("postedBy").sort({
              _id: 1
            }).limit(1);

          case 28:
            _next = _context4.sent;

            if (!(_next.length == 0)) {
              _context4.next = 33;
              break;
            }

            _context4.next = 32;
            return _articles["default"].find({
              active: true
            }).populate("category").populate("postedBy").sort({
              _id: 1
            }).limit(1);

          case 32:
            _next = _context4.sent;

          case 33:
            _context4.next = 35;
            return _articles["default"].find({
              active: true,
              _id: {
                $lt: article[0]._id
              },
              category: article[0].category._id,
              postedBy: article[0].postedBy._id
            }).populate("category").populate('postedBy').sort({
              _id: 1
            }).limit(1);

          case 35:
            previous = _context4.sent;

            if (!(previous.length == 0)) {
              _context4.next = 40;
              break;
            }

            _context4.next = 39;
            return _articles["default"].find({
              active: true
            }).populate("category").populate("postedBy").sort({
              _id: 1
            }).limit(1);

          case 39:
            previous = _context4.sent;

          case 40:
            _context4.next = 42;
            return _articles["default"].find({
              active: true,
              slug: {
                $ne: article[0].slug
              },
              addToFeatured: true
            }).populate("category").sort({
              createdAt: -1
            }).limit(5);

          case 42:
            featured = _context4.sent;
            _context4.next = 45;
            return _articles["default"].find({
              active: true,
              slug: {
                $ne: article[0].slug
              }
            }).sort({
              views: -1
            }).limit(3);

          case 45:
            popular = _context4.sent;
            _context4.next = 48;
            return _articles["default"].find({
              active: true,
              slug: {
                $ne: article[0].slug
              },
              addToRecommended: true
            }).populate("category").sort({
              createdAt: -1
            }).limit(12);

          case 48:
            recommended = _context4.sent;
            _context4.next = 51;
            return _articles["default"].find({
              active: true,
              slug: {
                $ne: article[0].slug
              }
            }).populate("postedBy").populate("category").sort({
              createdAt: -1
            }).limit(3);

          case 51:
            related = _context4.sent;
            d = new Date();
            customDate = "".concat(d.getDate(), "/").concat(d.getMonth(), "/").concat(d.getFullYear());
            ips = req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);
            _context4.next = 57;
            return _articles["default"].countDocuments();

          case 57:
            articleCount = _context4.sent;

            if (!(art.viewers.indexOf(ips) !== -1)) {
              _context4.next = 62;
              break;
            }

            res.render("single", {
              articleCount: articleCount,
              title: article[0].title,
              article: article[0],
              settings: settings,
              previous: previous[0],
              next: _next[0],
              featured: featured,
              popular: popular,
              recommended: recommended,
              related: related,
              bookmark: book,
              bookmarkId: bookmark == null ? null : bookmark._id
            });
            _context4.next = 66;
            break;

          case 62:
            ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);
            _context4.next = 65;
            return _articles["default"].updateOne({
              slug: req.params.slug.trim()
            }, {
              $push: {
                viewers: ip
              }
            });

          case 65:
            _articles["default"].updateOne({
              slug: req.params.slug.trim()
            }, {
              $inc: {
                views: 1
              }
            }).then(function (views) {
              res.render("single", {
                articleCount: articleCount,
                title: article[0].title,
                article: article[0],
                settings: settings,
                previous: previous[0],
                next: _next[0],
                featured: featured,
                popular: popular,
                recommended: recommended,
                related: related,
                bookmark: book,
                bookmarkId: bookmark == null ? null : bookmark._id
              });
            })["catch"](function (err) {
              return _next(err);
            });

          case 66:
            _context4.next = 71;
            break;

          case 68:
            _context4.prev = 68;
            _context4.t1 = _context4["catch"](0);
            next(_context4.t1);

          case 71:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 68]]);
  }));

  return function (_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}()); // Get single article page

router.get("/d/:category/:slug", _install["default"].redirectToLogin, /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    var settings, article, bookmark, book, art, _next2, index, previous, _index, featured, popular, recommended, related, d, customDate, ips, articleCount, ip;

    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            _context5.next = 3;
            return _settings["default"].findOne();

          case 3:
            settings = _context5.sent;
            _context5.next = 6;
            return _articles["default"].aggregate([{
              $match: {
                active: true,
                slug: req.params.slug
              }
            }, {
              $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category"
              }
            }, {
              $unwind: {
                path: "$category",
                preserveNullAndEmptyArrays: true
              }
            }, {
              $lookup: {
                from: "categories",
                localField: "subCategory",
                foreignField: "_id",
                as: "subCategory"
              }
            }, {
              $unwind: {
                path: "$subCategory",
                preserveNullAndEmptyArrays: true
              }
            }, {
              $lookup: {
                from: "users",
                localField: "postedBy",
                foreignField: "_id",
                as: "postedBy"
              }
            }, {
              $unwind: {
                path: "$postedBy",
                preserveNullAndEmptyArrays: true
              }
            }, {
              $lookup: {
                from: "comments",
                "let": {
                  indicator_id: "$_id"
                },
                as: "comments",
                pipeline: [{
                  $match: {
                    $expr: {
                      $eq: ["$articleId", "$$indicator_id"]
                    },
                    active: true
                  }
                }, {
                  $sort: {
                    createdAt: -1
                  }
                }]
              }
            }]);

          case 6:
            article = _context5.sent;

            if (!(article == "")) {
              _context5.next = 11;
              break;
            }

            res.render("404");
            _context5.next = 65;
            break;

          case 11:
            if (!(typeof req.user !== "undefined")) {
              _context5.next = 17;
              break;
            }

            _context5.next = 14;
            return _bookmark["default"].findOne({
              userId: req.user.id,
              articleId: article[0]._id
            });

          case 14:
            _context5.t0 = _context5.sent;
            _context5.next = 18;
            break;

          case 17:
            _context5.t0 = false;

          case 18:
            bookmark = _context5.t0;
            book = bookmark ? true : false;
            _context5.next = 22;
            return _articles["default"].findOne({
              slug: req.params.slug,
              active: true
            });

          case 22:
            art = _context5.sent;
            _context5.next = 25;
            return _articles["default"].find({
              active: true,
              _id: {
                $gt: article[0]._id
              },
              category: article[0].category._id,
              postedBy: article[0].postedBy._id
            }).populate("category").populate("postedBy").sort({
              _id: 1
            }).limit(1);

          case 25:
            _next2 = _context5.sent;

            if (!(_next2.length == 0)) {
              _context5.next = 31;
              break;
            }

            index = Math.floor(Math.random() * 100 % 28);
            _context5.next = 30;
            return _articles["default"].find({
              active: true
            }).populate("category").populate("postedBy").sort({
              _id: 1
            }).limit(1).skip(index);

          case 30:
            _next2 = _context5.sent;

          case 31:
            _context5.next = 33;
            return _articles["default"].find({
              active: true,
              _id: {
                $lt: article[0]._id
              },
              category: article[0].category._id,
              postedBy: article[0].postedBy._id
            }).populate("category").populate('postedBy').sort({
              _id: 1
            }).limit(1);

          case 33:
            previous = _context5.sent;

            if (!(previous.length == 0)) {
              _context5.next = 39;
              break;
            }

            _index = Math.floor(Math.random() * 100 % 28);
            _context5.next = 38;
            return _articles["default"].find({
              active: true
            }).populate("category").populate("postedBy").sort({
              _id: 1
            }).limit(1).skip(_index);

          case 38:
            previous = _context5.sent;

          case 39:
            _context5.next = 41;
            return _articles["default"].find({
              active: true,
              slug: {
                $ne: article[0].slug
              },
              addToFeatured: true
            }).populate("category").sort({
              createdAt: -1
            }).limit(5);

          case 41:
            featured = _context5.sent;
            _context5.next = 44;
            return _articles["default"].find({
              active: true,
              slug: {
                $ne: article[0].slug
              }
            }).sort({
              views: -1
            }).limit(3);

          case 44:
            popular = _context5.sent;
            _context5.next = 47;
            return _articles["default"].find({
              active: true,
              slug: {
                $ne: article[0].slug
              },
              addToRecommended: true
            }).populate("category").sort({
              createdAt: -1
            }).limit(12);

          case 47:
            recommended = _context5.sent;
            _context5.next = 50;
            return _articles["default"].find({
              active: true,
              slug: {
                $ne: article[0].slug
              }
            }).populate("postedBy").populate("category").sort({
              createdAt: -1
            }).limit(3);

          case 50:
            related = _context5.sent;
            d = new Date();
            customDate = "".concat(d.getDate(), "/").concat(d.getMonth(), "/").concat(d.getFullYear());
            ips = req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);
            _context5.next = 56;
            return _articles["default"].countDocuments();

          case 56:
            articleCount = _context5.sent;

            if (!(art.viewers.indexOf(ips) !== -1)) {
              _context5.next = 61;
              break;
            }

            res.render("single", {
              articleCount: articleCount,
              title: article[0].title,
              article: article[0],
              settings: settings,
              previous: previous[0],
              next: _next2[0],
              featured: featured,
              popular: popular,
              recommended: recommended,
              related: related,
              bookmark: book,
              bookmarkId: bookmark == null ? null : bookmark._id
            });
            _context5.next = 65;
            break;

          case 61:
            ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);
            _context5.next = 64;
            return _articles["default"].updateOne({
              slug: req.params.slug.trim()
            }, {
              $push: {
                viewers: ip
              }
            });

          case 64:
            _articles["default"].updateOne({
              slug: req.params.slug.trim()
            }, {
              $inc: {
                views: 1
              }
            }).then(function (views) {
              res.render("single", {
                articleCount: articleCount,
                title: article[0].title,
                article: article[0],
                settings: settings,
                previous: previous[0],
                next: _next2[0],
                featured: featured,
                popular: popular,
                recommended: recommended,
                related: related,
                bookmark: book,
                bookmarkId: bookmark == null ? null : bookmark._id
              });
            })["catch"](function (err) {
              return _next2(err);
            });

          case 65:
            _context5.next = 70;
            break;

          case 67:
            _context5.prev = 67;
            _context5.t1 = _context5["catch"](0);
            next(_context5.t1);

          case 70:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[0, 67]]);
  }));

  return function (_x13, _x14, _x15) {
    return _ref5.apply(this, arguments);
  };
}()); // Get article based on a category

router.get("/all-post", _install["default"].redirectToLogin, /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res, next) {
    var perPage, page;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            perPage = 7;
            page = req.query.page || 1;
            _context7.prev = 2;
            _context7.next = 5;
            return _category["default"].findOne({
              name: req.query.category
            }).then( /*#__PURE__*/function () {
              var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(category) {
                return _regenerator["default"].wrap(function _callee6$(_context6) {
                  while (1) {
                    switch (_context6.prev = _context6.next) {
                      case 0:
                        if (category) {
                          _context6.next = 4;
                          break;
                        }

                        res.status(404).render("404");
                        _context6.next = 6;
                        break;

                      case 4:
                        _context6.next = 6;
                        return _articles["default"].find({
                          category: category._id
                        }).populate("postedBy").sort({
                          createdAt: -1
                        }).skip(perPage * page - perPage).limit(perPage).exec(function (err, post) {
                          _articles["default"].countDocuments({
                            category: category._id
                          }).exec(function (err, count) {
                            if (err) return next(err);
                            res.render("category", {
                              post: post,
                              current: page,
                              pages: Math.ceil(count / perPage),
                              cat: req.query.category
                            });
                          });
                        });

                      case 6:
                      case "end":
                        return _context6.stop();
                    }
                  }
                }, _callee6);
              }));

              return function (_x19) {
                return _ref7.apply(this, arguments);
              };
            }())["catch"](function (e) {
              return next(e);
            });

          case 5:
            _context7.next = 10;
            break;

          case 7:
            _context7.prev = 7;
            _context7.t0 = _context7["catch"](2);
            next(_context7.t0);

          case 10:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[2, 7]]);
  }));

  return function (_x16, _x17, _x18) {
    return _ref6.apply(this, arguments);
  };
}()); // Get all the posts in a category

router.get("/kategorie/:slug", _install["default"].redirectToLogin, /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res, next) {
    var perPage, page, cat, post, count, recent, featured, popular;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.prev = 0;
            perPage = 9;
            page = req.query.page || 1;
            _context8.next = 5;
            return _category["default"].findOne({
              slug: req.params.slug
            });

          case 5:
            cat = _context8.sent;

            if (cat) {
              _context8.next = 10;
              break;
            }

            res.render("404");
            _context8.next = 26;
            break;

          case 10:
            _context8.next = 12;
            return _articles["default"].find({
              active: true,
              category: cat._id
            }).populate("category").populate("postedBy").populate("subCategory").skip(perPage * page - perPage).limit(perPage).sort({
              createdAt: -1
            });

          case 12:
            post = _context8.sent;
            _context8.next = 15;
            return _articles["default"].countDocuments({
              active: true,
              category: cat._id
            });

          case 15:
            count = _context8.sent;
            _context8.next = 18;
            return _articles["default"].find({
              active: true,
              category: {
                $ne: cat._id
              }
            }).sort({
              createdAt: -1
            }).populate("category").populate("postedBy").limit(5);

          case 18:
            recent = _context8.sent;
            _context8.next = 21;
            return _articles["default"].find({
              active: true,
              addToFeatured: true
            }).populate("category").sort({
              createdAt: -1
            }).limit(5);

          case 21:
            featured = _context8.sent;
            _context8.next = 24;
            return _articles["default"].find({
              active: true,
              category: cat._id
            }).populate("category").populate("postedBy").sort({
              views: -1
            }).limit(3);

          case 24:
            popular = _context8.sent;
            res.render("category", {
              title: cat.name,
              cat: cat.name,
              background: cat.background,
              post: post,
              current: page,
              pages: Math.ceil(count / perPage),
              recent: recent,
              featured: featured,
              popular: popular
            });

          case 26:
            _context8.next = 31;
            break;

          case 28:
            _context8.prev = 28;
            _context8.t0 = _context8["catch"](0);
            next(_context8.t0);

          case 31:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[0, 28]]);
  }));

  return function (_x20, _x21, _x22) {
    return _ref8.apply(this, arguments);
  };
}()); // Add to slider

router.post("/article/add-to-slider", function (req, res, next) {
  try {
    _articles["default"].updateMany({
      _id: req.body.ids
    }, {
      $set: {
        showPostOnSlider: true
      }
    }).then(function (deleted) {
      if (!req.body.ids) {
        req.flash("success_msg", "Nothing Was Updated");
        return res.redirect("/dashboard/all-posts");
      } else {
        req.flash("success_msg", "Articles Has Been Updated Successfully");
        return res.redirect("/dashboard/all-posts");
      }
    })["catch"](function (e) {
      return next(e);
    });
  } catch (error) {
    next(error);
  }
}); // Add to recommended

router.post("/article/add-to-recommended", function (req, res, next) {
  try {
    _articles["default"].updateMany({
      _id: req.body.ids
    }, {
      $set: {
        addToRecommended: true
      }
    }).then(function (deleted) {
      if (!req.body.ids) {
        req.flash("success_msg", "Nothing Was Updated");
        return res.redirect("/dashboard/all-posts");
      } else {
        req.flash("success_msg", "Articles Has Been Updated Successfully");
        return res.redirect("/dashboard/all-posts");
      }
    })["catch"](function (e) {
      return next(e);
    });
  } catch (error) {
    next(error);
  }
}); // Add to featured

router.post("/article/add-to-featured", function (req, res, next) {
  try {
    _articles["default"].updateMany({
      _id: req.body.ids
    }, {
      $set: {
        addToFeatured: true
      }
    }).then(function (deleted) {
      if (!req.body.ids) {
        req.flash("success_msg", "Nothing Was Updated");
        return res.redirect("/dashboard/all-posts");
      } else {
        req.flash("success_msg", "Articles Has Been Updated Successfully");
        return res.redirect("/dashboard/all-posts");
      }
    })["catch"](function (e) {
      return next(e);
    });
  } catch (error) {
    next(error);
  }
}); // Add to breaking

router.post("/article/add-to-breaking", function (req, res, next) {
  try {
    _articles["default"].updateMany({
      _id: req.body.ids
    }, {
      $set: {
        addToBreaking: true
      }
    }).then(function (deleted) {
      if (!req.body.ids) {
        req.flash("success_msg", "Nothing Was Updated");
        return res.redirect("/dashboard/all-posts");
      } else {
        req.flash("success_msg", "Articles Has Been Updated Successfully");
        return res.redirect("/dashboard/all-posts");
      }
    })["catch"](function (e) {
      return next(e);
    });
  } catch (error) {
    next(error);
  }
}); // Upvote a post

router.post("/article/upvote", _auth["default"], /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(req, res, next) {
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return _articles["default"].updateOne({
              _id: req.body.articleId
            }, {
              $push: {
                "update.users": req.user.id
              },
              $inc: {
                "upvote.count": 1
              }
            });

          case 2:
            return _context9.abrupt("return", res.redirect("back"));

          case 3:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));

  return function (_x23, _x24, _x25) {
    return _ref9.apply(this, arguments);
  };
}());
router.post('/article/upvote-ajax', _auth["default"], /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(req, res, next) {
    var articleId, userId, article, upvotecount;
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            articleId = req.body.articleId;
            userId = req.body.userId;
            _context10.next = 4;
            return _articles["default"].updateOne({
              _id: req.body.articleId
            }, {
              $push: {
                "update.users": req.user.id
              },
              $inc: {
                "upvote.count": 1
              }
            });

          case 4:
            _context10.next = 6;
            return _articles["default"].findOne({
              _id: articleId
            });

          case 6:
            article = _context10.sent;
            upvotecount = article.upvote.count;
            res.json(upvotecount);

          case 9:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));

  return function (_x26, _x27, _x28) {
    return _ref10.apply(this, arguments);
  };
}()); // Downvote a post

router.post("/article/downvote", _auth["default"], /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(req, res, next) {
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.next = 2;
            return _articles["default"].updateOne({
              _id: req.body.articleId
            }, {
              $push: {
                "update.users": req.user.id
              },
              $inc: {
                "upvote.count": -1
              }
            });

          case 2:
            res.status(200).send("Post Has been Downvoted");

          case 3:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11);
  }));

  return function (_x29, _x30, _x31) {
    return _ref11.apply(this, arguments);
  };
}()); // Flag an article

router.post("/article/flag", /*#__PURE__*/function () {
  var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(req, res, next) {
    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            _context12.next = 2;
            return _flag["default"].create({
              articleId: req.body.articleId,
              reason: req.body.reason.trim(),
              userId: req.user.id != undefined ? req.user.id : undefined
            });

          case 2:
            res.status(200).send("Post has been flagged, Admin will look into it anytime soon.");

          case 3:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12);
  }));

  return function (_x32, _x33, _x34) {
    return _ref12.apply(this, arguments);
  };
}()); // Clap under an article

router.post("/article/clap", /*#__PURE__*/function () {
  var _ref13 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(req, res, next) {
    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _context13.next = 2;
            return _articles["default"].updateOne({
              _id: req.body.articleId
            }, {
              $inc: {
                claps: 1
              }
            });

          case 2:
            res.status(200).send("Clapped under post");

          case 3:
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