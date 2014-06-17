var io;
(function (io) {
    (function (xperiments) {
        (function (angularjs) {
            var AppBase = (function () {
                function AppBase(id, dependencies) {
                    if (typeof id === "undefined") { id = "app"; }
                    if (typeof dependencies === "undefined") { dependencies = []; }
                    this.id = id;
                    this.dependencies = dependencies;
                    this.app = angular.module(id, dependencies);
                    this.boot();
                }
                AppBase.prototype.boot = function () {
                };

                AppBase.prototype.wireServices = function (package) {
                    this.app.service(package);
                };
                AppBase.prototype.wireControllers = function (package) {
                    this.app.controller(package);
                };
                AppBase.prototype.wireDirectives = function (package) {
                    var _this = this;
                    Object.keys(package).forEach(function (clsName) {
                        package[clsName].hasOwnProperty('inject') && _this.app.directive(package[clsName].inject);
                    });
                };
                AppBase.prototype.wireFilters = function (package) {
                    var _this = this;
                    Object.keys(package).forEach(function (clsName) {
                        package[clsName].hasOwnProperty('inject') && _this.app.filter(package[clsName].inject);
                    });
                };
                AppBase.prototype.config = function (package) {
                    var _this = this;
                    Object.keys(package).forEach(function (clsName) {
                        _this.app.config(package[clsName]);
                    });
                };
                return AppBase;
            })();
            angularjs.AppBase = AppBase;
        })(xperiments.angularjs || (xperiments.angularjs = {}));
        var angularjs = xperiments.angularjs;
    })(io.xperiments || (io.xperiments = {}));
    var xperiments = io.xperiments;
})(io || (io = {}));
var xp;
(function (xp) {
    (function (mdposteditor) {
        var DI = (function () {
            function DI() {
            }
            DI.ngRoute = "ngRoute";
            DI.ngSanitize = "ngSanitize";
            DI.$scope = "$scope";
            DI.$rootScope = "$rootScope";
            DI.$routeParams = "$routeParams";
            DI.$stateProvider = "$stateProvider";
            DI.$location = "$location";
            DI.$http = "$http";
            DI.$q = "$q";
            DI.$timeout = "$timeout";

            DI.uiAce = "ui.ace";
            DI.markdown = "btford.markdown";

            DI.FlickrCommons = "FlickrCommons";
            DI.PostLoader = "PostLoader";
            DI.PostWriter = "PostWriter";
            DI.PostDirectory = "PostDirectory";
            DI.Media = "Media";
            DI.MessageBus = "MessageBus";
            DI.HanSON = "HanSON";
            DI.FileUploader = "FileUploader";
            DI.GalleryPickerService = "GalleryPickerService";
            return DI;
        })();
        mdposteditor.DI = DI;
    })(xp.mdposteditor || (xp.mdposteditor = {}));
    var mdposteditor = xp.mdposteditor;
})(xp || (xp = {}));
var xp;
(function (xp) {
    (function (mdposteditor) {
        (function (config) {
            var Router = (function () {
                function Router($routeProvider, $locationProvider) {
                    $routeProvider.when('/', {
                        template: ListPostView.html,
                        controller: xp.mdposteditor.controllers.ListPostsController,
                        controllerAs: 'list'
                    }).when('/posts', {
                        template: ListPostView.html,
                        controller: xp.mdposteditor.controllers.ListPostsController,
                        controllerAs: 'list'
                    }).when('/edit/:id', {
                        template: EditPostView.html,
                        controller: xp.mdposteditor.controllers.EditPostController,
                        controllerAs: 'edit'
                    });
                }
                Router.$inject = ['$routeProvider', '$locationProvider'];
                return Router;
            })();
            config.Router = Router;
        })(mdposteditor.config || (mdposteditor.config = {}));
        var config = mdposteditor.config;
    })(xp.mdposteditor || (xp.mdposteditor = {}));
    var mdposteditor = xp.mdposteditor;
})(xp || (xp = {}));
var xp;
(function (xp) {
    (function (mdposteditor) {
        (function (models) {
            var Post = (function () {
                function Post() {
                }
                Post.prototype.serialize = function () {
                    var jsonMetadata = {};
                    jsonMetadata.title = this.title;
                    jsonMetadata.date = this.date;
                    this.description && (jsonMetadata.description = this.description);
                    this.image && this.image != "" && (jsonMetadata.image = this.image.replace('./src', ''));
                    this.categories && (jsonMetadata.categories = this.categories);
                    return (JSON.stringify(jsonMetadata, null, 4) + '\n' + this.content);
                };
                Post.prototype.mix = function (json) {
                    var _this = this;
                    Object.keys(json).forEach(function (key) {
                        _this[key] = json[key];
                    });
                };

                Post.getDateString = function (date) {
                    return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-');
                };
                return Post;
            })();
            models.Post = Post;
        })(mdposteditor.models || (mdposteditor.models = {}));
        var models = mdposteditor.models;
    })(xp.mdposteditor || (xp.mdposteditor = {}));
    var mdposteditor = xp.mdposteditor;
})(xp || (xp = {}));
var xp;
(function (xp) {
    (function (mdposteditor) {
        (function (services) {
            var HanSON = (function () {
                function HanSON() {
                    return window.HanSON;
                }
                return HanSON;
            })();
            services.HanSON = HanSON;
        })(mdposteditor.services || (mdposteditor.services = {}));
        var services = mdposteditor.services;
    })(xp.mdposteditor || (xp.mdposteditor = {}));
    var mdposteditor = xp.mdposteditor;
})(xp || (xp = {}));
var xp;
(function (xp) {
    (function (mdposteditor) {
        (function (services) {
            var DI = xp.mdposteditor.DI;

            var FileUploader = (function () {
                function FileUploader($http) {
                    this.$http = $http;
                }
                FileUploader.prototype.uploadFilesToUrl = function (uploadUrl, contents, uploadDir, type) {
                    if (typeof type === "undefined") { type = "image"; }
                    var fd = new FormData();
                    fd.append('uploadDir', uploadDir);
                    fd.append('type', type);
                    contents.forEach(function (file) {
                        fd.append("uploadFiles[]", file.contents, file.name);
                    });

                    return this.$http.post(uploadUrl, fd, {
                        transformRequest: angular.identity,
                        headers: { 'Content-Type': undefined }
                    }).then(function (data) {
                        console.log('cccc', data);
                        return data.data;
                    });
                };
                FileUploader.prototype.deleteFile = function (file) {
                    var fd = new FormData();
                    fd.append('file', file);

                    return this.$http.post('/delete', fd, {
                        transformRequest: angular.identity,
                        headers: { 'Content-Type': undefined }
                    }).then(function (data) {
                        console.log('deleted', data);
                        return data.data;
                    });
                };
                FileUploader.prototype.downloadFile = function (source, dest) {
                    return this.$http.get('/downloadFile', { params: { src: source, dst: dest } }).then(function (data) {
                        console.log('downloaded image', data);
                        return data.data;
                    });
                };
                FileUploader.prototype.getPostFileName = function (postTile) {
                    return postTile.toLowerCase().replace(/^\s+|\s+$/g, '').replace(/[_|\s|\.]+/g, '-').replace(/[^a-z\u0400-\u04FF0-9-]+/g, '').replace(/[-]+/g, '-').replace(/^-+|-+$/g, '');
                };
                FileUploader.$inject = [DI.$http];
                return FileUploader;
            })();
            services.FileUploader = FileUploader;
        })(mdposteditor.services || (mdposteditor.services = {}));
        var services = mdposteditor.services;
    })(xp.mdposteditor || (xp.mdposteditor = {}));
    var mdposteditor = xp.mdposteditor;
})(xp || (xp = {}));
var xp;
(function (xp) {
    (function (mdposteditor) {
        (function (services) {
            var Post = xp.mdposteditor.models.Post;
            var DI = xp.mdposteditor.DI;
            var PostLoader = (function () {
                function PostLoader($http, $timeout, $q, hanSON) {
                    this.$http = $http;
                    this.$timeout = $timeout;
                    this.$q = $q;
                    this.hanSON = hanSON;
                }
                PostLoader.prototype.load = function (fileName) {
                    var _this = this;
                    var deferred = this.$q.defer();
                    if (fileName == "::new") {
                        var newPost = new Post();
                        newPost.date = Post.getDateString(new Date);

                        deferred.resolve(newPost);
                        return deferred.promise;
                    } else {
                        this.$http.get('/posts/' + fileName).then(function (data) {
                            deferred.resolve(_this.getMetadata(data.data, fileName));
                        });

                        return deferred.promise;
                    }
                };

                PostLoader.prototype.getMetadata = function (content, filename) {
                    var curlyNest = 1;
                    var currentIndex = content.indexOf('{') + 1;

                    while (curlyNest !== 0 && content.substr(currentIndex).length > 0) {
                        if (content.substr(currentIndex).indexOf('}') === -1 && content.substr(currentIndex).indexOf('{') === -1) {
                            return null;
                        }
                        if (content.substr(currentIndex).indexOf('}') !== -1) {
                            if (content.substr(currentIndex).indexOf('{') !== -1) {
                                if (content.substr(currentIndex).indexOf('}') < content.substr(currentIndex).indexOf('{')) {
                                    currentIndex += content.substr(currentIndex).indexOf('}') + 1;
                                    curlyNest--;
                                } else {
                                    currentIndex += content.substr(currentIndex).indexOf('{') + 1;
                                    curlyNest++;
                                }
                            } else {
                                currentIndex += content.substr(currentIndex).indexOf('}') + 1;
                                curlyNest--;
                            }
                        } else {
                            currentIndex += content.substr(currentIndex).indexOf('{') + 1;
                            curlyNest++;
                        }
                    }

                    var metadata = this.hanSON.parse(content.substr(0, currentIndex));
                    var content = content.substr(currentIndex + 1);
                    metadata['content'] = content;
                    metadata['file'] = filename;
                    return metadata;
                };
                PostLoader.$inject = [
                    DI.$http,
                    DI.$timeout,
                    DI.$q,
                    DI.HanSON
                ];
                return PostLoader;
            })();
            services.PostLoader = PostLoader;
        })(mdposteditor.services || (mdposteditor.services = {}));
        var services = mdposteditor.services;
    })(xp.mdposteditor || (xp.mdposteditor = {}));
    var mdposteditor = xp.mdposteditor;
})(xp || (xp = {}));
var xp;
(function (xp) {
    (function (mdposteditor) {
        (function (services) {
            var DI = xp.mdposteditor.DI;
            var PostDirectory = (function () {
                function PostDirectory($http) {
                    this.$http = $http;
                    this.posts = {};
                }
                PostDirectory.prototype.getPosts = function () {
                    var _this = this;
                    return this.$http.get('/listPosts').success(function (data) {
                        _this.posts = data;
                    });
                };
                PostDirectory.$inject = [DI.$http];
                return PostDirectory;
            })();
            services.PostDirectory = PostDirectory;
        })(mdposteditor.services || (mdposteditor.services = {}));
        var services = mdposteditor.services;
    })(xp.mdposteditor || (xp.mdposteditor = {}));
    var mdposteditor = xp.mdposteditor;
})(xp || (xp = {}));
var xp;
(function (xp) {
    (function (mdposteditor) {
        (function (services) {
            var DI = xp.mdposteditor.DI;

            var FlickrCommons = (function () {
                function FlickrCommons($http) {
                    this.$http = $http;
                    this.search('cars');
                }
                FlickrCommons.prototype.search = function (text, per_page) {
                    var _this = this;
                    if (typeof per_page === "undefined") { per_page = 100; }
                    return this.$http({
                        url: 'https://api.flickr.com/services/rest/',
                        method: "GET",
                        params: {
                            method: "flickr.photos.search",
                            api_key: "2c6a2d4c00106f6f3fe64dcfa433c9ca",
                            tags: text.replace(' ', ','),
                            text: text,
                            license: "1%2C2%2C3%2C4%2C5%2C6%2C7",
                            format: "json",
                            nojsoncallback: "1",
                            sort: "relevance",
                            per_page: per_page
                        }
                    }).then(function (response) {
                        var photos = response.data.photos.photo;
                        var images = [];
                        _this.searchPhotoResults = photos.map(function (datas) {
                            var id = datas.id;
                            var title = datas.title;
                            var secret = datas.secret;
                            var server = datas.server;
                            var farm = datas.farm;
                            var owner = datas.owner;
                            var base = id + '_' + secret + '_s.jpg';
                            var major = id + '_' + secret + '_b.jpg';
                            var url = 'http://farm' + farm + '.static.flickr.com/' + server + '/' + major;
                            var img = 'http://farm' + farm + '.static.flickr.com/' + server + '/' + base;

                            return { small: img, big: url };
                        });

                        _this.searchResult = {
                            page: response.data.photos.page,
                            pages: response.data.photos.pages,
                            perpage: response.data.photos.perpage,
                            images: _this.searchPhotoResults
                        };
                    });
                };
                FlickrCommons.$inject = [DI.$http];
                return FlickrCommons;
            })();
            services.FlickrCommons = FlickrCommons;
        })(mdposteditor.services || (mdposteditor.services = {}));
        var services = mdposteditor.services;
    })(xp.mdposteditor || (xp.mdposteditor = {}));
    var mdposteditor = xp.mdposteditor;
})(xp || (xp = {}));
var xp;
(function (xp) {
    (function (mdposteditor) {
        (function (services) {
            var DI = xp.mdposteditor.DI;

            var PostWriter = (function () {
                function PostWriter($http, fileUploader) {
                    this.$http = $http;
                    this.fileUploader = fileUploader;
                }
                PostWriter.prototype.updatePost = function (post) {
                    var postFile = post.serialize();
                    var blob = new Blob([postFile], { type: "text/plain" });
                    var fileName = post.file ? post.file : this.fileUploader.getPostFileName(post.title) + '.md';
                    return this.fileUploader.uploadFilesToUrl('/upload', [{ contents: blob, name: fileName }], './posts/', 'post');
                };
                PostWriter.$inject = [DI.$http, DI.FileUploader];
                return PostWriter;
            })();
            services.PostWriter = PostWriter;
        })(mdposteditor.services || (mdposteditor.services = {}));
        var services = mdposteditor.services;
    })(xp.mdposteditor || (xp.mdposteditor = {}));
    var mdposteditor = xp.mdposteditor;
})(xp || (xp = {}));
var xp;
(function (xp) {
    (function (mdposteditor) {
        (function (services) {
            var DI = xp.mdposteditor.DI;

            var Media = (function () {
                function Media($http) {
                    this.$http = $http;
                }
                Media.prototype.listMedia = function () {
                    return this.$http.get('/listImages').then(function (data) {
                        return data.data;
                    });
                };
                Media.$inject = [DI.$http];
                return Media;
            })();
            services.Media = Media;
        })(mdposteditor.services || (mdposteditor.services = {}));
        var services = mdposteditor.services;
    })(xp.mdposteditor || (xp.mdposteditor = {}));
    var mdposteditor = xp.mdposteditor;
})(xp || (xp = {}));

var xp;
(function (xp) {
    (function (mdposteditor) {
        (function (services) {
            var DI = xp.mdposteditor.DI;
            var MessageBus = (function () {
                function MessageBus($rootScope) {
                    this.$rootScope = $rootScope;
                }
                MessageBus.prototype.emit = function (msg, data) {
                    data = data || {};
                    this.$rootScope.$emit(msg, data);
                };
                MessageBus.prototype.on = function (msg, func, scope) {
                    var unbind = this.$rootScope.$on(msg, func);
                    scope && scope.$on('$destroy', unbind);
                    return unbind;
                };
                MessageBus.$inject = [DI.$rootScope];
                return MessageBus;
            })();
            services.MessageBus = MessageBus;
        })(mdposteditor.services || (mdposteditor.services = {}));
        var services = mdposteditor.services;
    })(xp.mdposteditor || (xp.mdposteditor = {}));
    var mdposteditor = xp.mdposteditor;
})(xp || (xp = {}));
var xp;
(function (xp) {
    (function (mdposteditor) {
        (function (filters) {
            var ToArray = (function () {
                function ToArray() {
                }
                ToArray.toArray = function (obj) {
                    var result = [];
                    angular.forEach(obj, function (val, key) {
                        result.push(val);
                    });
                    return result;
                };
                ToArray.inject = { "toArray": function () {
                        return ToArray.toArray;
                    } };
                return ToArray;
            })();
            filters.ToArray = ToArray;
        })(mdposteditor.filters || (mdposteditor.filters = {}));
        var filters = mdposteditor.filters;
    })(xp.mdposteditor || (xp.mdposteditor = {}));
    var mdposteditor = xp.mdposteditor;
})(xp || (xp = {}));
var xp;
(function (xp) {
    (function (mdposteditor) {
        (function (controllers) {
            var Post = xp.mdposteditor.models.Post;

            var DI = xp.mdposteditor.DI;

            var EditPostController = (function () {
                function EditPostController($scope, $routeParams, $location, postLoader, postWriter, media, msgBus, galleryPickerService) {
                    var _this = this;
                    this.$scope = $scope;
                    this.$routeParams = $routeParams;
                    this.$location = $location;
                    this.postLoader = postLoader;
                    this.postWriter = postWriter;
                    this.media = media;
                    this.msgBus = msgBus;
                    this.galleryPickerService = galleryPickerService;
                    this.image = "";
                    this.markdown = "";
                    this.previewVisible = false;
                    this.hasHeadImage = false;
                    $scope.aceLoaded = function (editor) {
                        _this.editor = editor;
                    };
                    postLoader.load($routeParams.id).then(function (response) {
                        _this.post = new Post();
                        _this.post.mix(response);
                        _this.post.image && (_this.hasHeadImage = true);
                    });
                }
                EditPostController.prototype.togglePreview = function () {
                    this.previewVisible = !this.previewVisible;
                };
                EditPostController.prototype.insertImage = function () {
                    var _this = this;
                    this.galleryPickerService.pickFile().then(function (file) {
                        _this.editor.insert('\r\n');
                        _this.editor.insert('![image](' + file.replace('/src', '') + ') ');
                        _this.editor.insert('\r\n');
                        _this.updateEditor();
                    });
                };
                EditPostController.prototype.updatePost = function () {
                    var _this = this;
                    this.postWriter.updatePost(this.post).then(function () {
                        return _this.$location.path("/");
                    });
                };
                EditPostController.prototype.updateEditor = function () {
                    this.post.content = this.editor.getSession().getValue();
                };
                EditPostController.prototype.setStyle = function (style) {
                    var selection = this.getSelection();
                    var result = "";
                    switch (style) {
                        case "b":
                            result = ["**", selection, "**"].join('');
                            break;
                        case "i":
                            result = ["*", selection, "*"].join('');
                            break;
                        case "q":
                            result = ["\n> ", selection].join('');
                            break;
                        case "o":
                            result = ["\n1. ", selection].join('');
                            break;
                        case "u":
                            result = ["\n - ", selection].join('');
                            break;
                        case "h":
                            result = ["\n----------\n", selection].join('');
                            break;
                    }
                    this.editor.insert(result);
                    this.updateEditor();
                };

                EditPostController.prototype.pickHeader = function () {
                    var _this = this;
                    this.galleryPickerService.pickFile().then(function (file) {
                        _this.post.image = file.substr(4);
                        _this.hasHeadImage = true;
                    });
                };
                EditPostController.prototype.clearHeader = function () {
                    this.post.image = null;
                    this.hasHeadImage = false;
                };

                EditPostController.prototype.getSelection = function () {
                    return this.editor.session.getTextRange(this.editor.getSelectionRange());
                };
                EditPostController.$inject = [
                    DI.$scope,
                    DI.$routeParams,
                    DI.$location,
                    DI.PostLoader,
                    DI.PostWriter,
                    DI.Media,
                    DI.MessageBus,
                    DI.GalleryPickerService
                ];
                return EditPostController;
            })();
            controllers.EditPostController = EditPostController;
        })(mdposteditor.controllers || (mdposteditor.controllers = {}));
        var controllers = mdposteditor.controllers;
    })(xp.mdposteditor || (xp.mdposteditor = {}));
    var mdposteditor = xp.mdposteditor;
})(xp || (xp = {}));
var xp;
(function (xp) {
    (function (mdposteditor) {
        (function (controllers) {
            var DI = xp.mdposteditor.DI;
            var ListPostsController = (function () {
                function ListPostsController($scope, postDirectory, fileUploader) {
                    this.$scope = $scope;
                    this.postDirectory = postDirectory;
                    this.fileUploader = fileUploader;
                    this.listPosts();
                }
                ListPostsController.prototype.listPosts = function () {
                    var _this = this;
                    return this.postDirectory.getPosts().then(function () {
                        return _this.posts = _this.postDirectory.posts;
                    });
                };
                ListPostsController.prototype.deletePost = function (file) {
                    var _this = this;
                    return this.fileUploader.deleteFile(file).then(function () {
                        _this.listPosts();
                    });
                };
                ListPostsController.$inject = [DI.$scope, DI.PostDirectory, DI.FileUploader];
                return ListPostsController;
            })();
            controllers.ListPostsController = ListPostsController;
        })(mdposteditor.controllers || (mdposteditor.controllers = {}));
        var controllers = mdposteditor.controllers;
    })(xp.mdposteditor || (xp.mdposteditor = {}));
    var mdposteditor = xp.mdposteditor;
})(xp || (xp = {}));
var xp;
(function (xp) {
    (function (mdposteditor) {
        (function (controllers) {
            var DI = xp.mdposteditor.DI;
            var MediaController = (function () {
                function MediaController($scope, flickrCommons) {
                    this.$scope = $scope;
                    this.flickrCommons = flickrCommons;
                    this.searchValue = "";
                    this.per_page = 100;
                }
                MediaController.prototype.search = function () {
                    var _this = this;
                    if (this.searchValue == "")
                        return;
                    this.flickrCommons.search(this.searchValue, this.per_page).then(function () {
                        _this.searchImages = _this.flickrCommons.searchPhotoResults;
                    });
                };
                MediaController.$inject = [DI.$scope, DI.FlickrCommons];
                return MediaController;
            })();
            controllers.MediaController = MediaController;
        })(mdposteditor.controllers || (mdposteditor.controllers = {}));
        var controllers = mdposteditor.controllers;
    })(xp.mdposteditor || (xp.mdposteditor = {}));
    var mdposteditor = xp.mdposteditor;
})(xp || (xp = {}));
var xp;
(function (xp) {
    (function (mdposteditor) {
        (function (controllers) {
            var DI = xp.mdposteditor.DI;
            var SideController = (function () {
                function SideController($scope) {
                    this.$scope = $scope;
                }
                SideController.prototype.dashboard = function () {
                };
                SideController.prototype.posts = function () {
                };
                SideController.prototype.media = function () {
                };
                SideController.$inject = [DI.$scope];
                return SideController;
            })();
            controllers.SideController = SideController;
        })(mdposteditor.controllers || (mdposteditor.controllers = {}));
        var controllers = mdposteditor.controllers;
    })(xp.mdposteditor || (xp.mdposteditor = {}));
    var mdposteditor = xp.mdposteditor;
})(xp || (xp = {}));
var xp;
(function (xp) {
    (function (mdposteditor) {
        (function (controllers) {
            var DI = xp.mdposteditor.DI;

            var GalleryPickerController = (function () {
                function GalleryPickerController($scope, $timeout, media, msgBus, fileUploader) {
                    var _this = this;
                    this.$scope = $scope;
                    this.$timeout = $timeout;
                    this.media = media;
                    this.msgBus = msgBus;
                    this.fileUploader = fileUploader;
                    this.visible = false;
                    this.folderDepth = [];
                    this.folderPath = ['root'];
                    this.msgBus.on(GalleryPickerController.PICK, function (event, deferred) {
                        _this.currentDeferred = deferred;
                        _this.toggleGalleryPicker();
                    }, $scope);
                }
                GalleryPickerController.prototype.toggleGalleryPicker = function () {
                    this.visible = !this.visible;
                    this.folderPath = ['root'];
                    if (this.visible) {
                        this.updateMedia();
                    }
                };
                GalleryPickerController.prototype.close = function () {
                    this.currentDeferred.reject();
                };
                GalleryPickerController.prototype.showFolder = function (file) {
                    this.lastFolder = file;
                    this.folderPath.push(file.name);
                    this.folderDepth.push(this.imageNode);
                    this.imageNode = file.children;
                };
                GalleryPickerController.prototype.selectImage = function (image) {
                    this.toggleGalleryPicker();
                    this.currentDeferred.resolve(image);
                };

                GalleryPickerController.prototype.folderUp = function () {
                    this.folderPath.pop();
                    this.imageNode = this.folderDepth.pop();
                };
                GalleryPickerController.prototype.isMediaFile = function (file) {
                    return ['.jpg', '.png', '.gif'].indexOf(file.ext) != -1;
                };
                GalleryPickerController.prototype.onDrop = function (dropObject) {
                    var _this = this;
                    if (typeof dropObject === "undefined") { dropObject = null; }
                    if (dropObject.textDrop) {
                        this.fileUploader.downloadFile(dropObject.textDrop, './src/images/' + this.getRelativeUploadPath() + this.hashCode(dropObject.textDrop)).then(function (data) {
                            _this.$timeout(function () {
                                _this.toggleGalleryPicker();
                                _this.currentDeferred.resolve(data.downloadedImage);
                            }, 1000);
                        });
                    } else {
                        this.fileUploader.uploadFilesToUrl('/upload', [{ contents: dropObject.file, name: dropObject.file.name }], './src/images/' + this.getRelativeUploadPath()).then(function (data) {
                            _this.toggleGalleryPicker();
                            _this.currentDeferred.resolve(data.uploadedFiles[0].path);
                        });
                    }
                };

                GalleryPickerController.prototype.updateMedia = function () {
                    var _this = this;
                    return this.media.listMedia().then(function (data) {
                        return _this.initFolder(data);
                    });
                };

                GalleryPickerController.prototype.initFolder = function (data) {
                    this.rootPath = data.path;
                    this.imageNode = data.children;
                    this.lastFolder = data;
                };

                GalleryPickerController.prototype.getRelativeUploadPath = function () {
                    var path = this.folderPath.slice(0);
                    path.push('');
                    path.shift();
                    console.log(path.join('/'));
                    return path.join('/');
                };
                GalleryPickerController.prototype.hashCode = function (str) {
                    var hash = 0;
                    if (str.length == 0)
                        return hash;
                    for (var i = 0, total = str.length, char; i < total; i++) {
                        char = str.charCodeAt(i);
                        hash = ((hash << 5) - hash) + char;
                        hash = hash & hash;
                    }
                    return hash;
                };
                GalleryPickerController.$inject = [
                    DI.$scope,
                    DI.$timeout,
                    DI.Media,
                    DI.MessageBus,
                    DI.FileUploader
                ];
                GalleryPickerController.PICK = "GalleryPickerController.PICK";
                GalleryPickerController.CLOSE = "GalleryPickerController.CLOSE";
                GalleryPickerController.SELECT = "GalleryPickerController.SELECT";
                return GalleryPickerController;
            })();
            controllers.GalleryPickerController = GalleryPickerController;
        })(mdposteditor.controllers || (mdposteditor.controllers = {}));
        var controllers = mdposteditor.controllers;
    })(xp.mdposteditor || (xp.mdposteditor = {}));
    var mdposteditor = xp.mdposteditor;
})(xp || (xp = {}));

var xp;
(function (xp) {
    (function (mdposteditor) {
        (function (directives) {
            var FileDropZoneDirective = (function () {
                function FileDropZoneDirective() {
                    this.restrict = "A";
                    this.scope = {
                        file: '=',
                        fileName: '=',
                        onDrop: '&'
                    };
                }
                FileDropZoneDirective.prototype.link = function (scope, element, attrs, $http) {
                    var checkSize, isTypeValid, processDragOverOrEnter, validMimeTypes;
                    processDragOverOrEnter = function (event) {
                        if (event != null) {
                            event.preventDefault();
                        }
                        event.dataTransfer.effectAllowed = 'copy';
                        return false;
                    };
                    validMimeTypes = attrs['fileDropzone'];
                    checkSize = function (size) {
                        var _ref;
                        if (((_ref = attrs['maxFileSize']) === (void 0) || _ref === '') || (size / 1024) / 1024 < attrs['maxFileSize']) {
                            return true;
                        } else {
                            alert("File must be smaller than " + attrs['maxFileSize'] + " MB");
                            return false;
                        }
                    };
                    isTypeValid = function (type) {
                        if ((validMimeTypes === (void 0) || validMimeTypes === '') || validMimeTypes.indexOf(type) > -1) {
                            return true;
                        } else {
                            alert("Invalid file type.  File must be one of following types " + validMimeTypes);
                            return false;
                        }
                    };
                    element.bind('dragover', processDragOverOrEnter);
                    element.bind('dragenter', processDragOverOrEnter);
                    return element.bind('drop', function (event) {
                        var file, name, reader, size, type;
                        if (event != null) {
                            event.preventDefault();
                        }
                        var textDrop = event.dataTransfer.getData('Text');
                        if (textDrop != "") {
                            if (textDrop.indexOf('http') != 0)
                                return false;
                            scope.onDrop && scope.onDrop({ data: { textDrop: textDrop } });
                            return false;
                        }

                        file = event.dataTransfer.files[0];
                        name = file.name;
                        type = file.type;
                        size = file.size;

                        reader = new FileReader();
                        reader.onload = function (evt) {
                            if (checkSize(size) && isTypeValid(type)) {
                                return scope.$apply(function () {
                                    scope.file = file;
                                    if (angular.isString(scope.fileName)) {
                                        scope.fileName = name;
                                    }
                                    scope.onDrop && scope.onDrop({ data: { file: file } });
                                });
                            }
                        };

                        reader.readAsDataURL(file);
                        return false;
                    });
                };
                FileDropZoneDirective.inject = { "fileDropzone": function () {
                        return new FileDropZoneDirective();
                    } };
                return FileDropZoneDirective;
            })();
            directives.FileDropZoneDirective = FileDropZoneDirective;
        })(mdposteditor.directives || (mdposteditor.directives = {}));
        var directives = mdposteditor.directives;
    })(xp.mdposteditor || (xp.mdposteditor = {}));
    var mdposteditor = xp.mdposteditor;
})(xp || (xp = {}));
var xp;
(function (xp) {
    (function (mdposteditor) {
        (function (directives) {
            var EnterKey = (function () {
                function EnterKey() {
                }
                EnterKey.prototype.link = function (scope, element, attrs) {
                    element.bind("keydown keypress", function (event) {
                        if (event.which === 13) {
                            scope.$apply(function () {
                                scope.$eval(attrs['ngEnter'], { 'event': event });
                            });

                            event.preventDefault();
                        }
                    });
                };
                EnterKey.inject = { "ngEnter": function () {
                        return new EnterKey;
                    } };
                return EnterKey;
            })();
            directives.EnterKey = EnterKey;
        })(mdposteditor.directives || (mdposteditor.directives = {}));
        var directives = mdposteditor.directives;
    })(xp.mdposteditor || (xp.mdposteditor = {}));
    var mdposteditor = xp.mdposteditor;
})(xp || (xp = {}));
var xp;
(function (xp) {
    (function (mdposteditor) {
        (function (directives) {
            var GalleryPickerController = xp.mdposteditor.controllers.GalleryPickerController;
            var GalleryPickerDirective = (function () {
                function GalleryPickerDirective() {
                    this.scope = {
                        onSelect: '&',
                        selectedPath: '='
                    };
                    this.restrict = 'E';
                    this.controller = GalleryPickerController;
                    this.controllerAs = "gallery";
                    this.template = GalleryPicker.html;
                }
                GalleryPickerDirective.prototype.link = function (scope, element, attrs, ctrl) {
                    console.log(scope, element, attrs, ctrl);
                };
                GalleryPickerDirective.inject = { "mdGallery": function () {
                        return new GalleryPickerDirective;
                    } };
                return GalleryPickerDirective;
            })();
            directives.GalleryPickerDirective = GalleryPickerDirective;
        })(mdposteditor.directives || (mdposteditor.directives = {}));
        var directives = mdposteditor.directives;
    })(xp.mdposteditor || (xp.mdposteditor = {}));
    var mdposteditor = xp.mdposteditor;
})(xp || (xp = {}));
var EditPostView;
(function (EditPostView) {
    EditPostView.html = '<md-gallery></md-gallery><!-- EDIT POST --><div class="row">	<div class="col-lg-12 xp-admin--page">		<!-- /.panel -->		<div class="panel panel-default">			<div class="panel-heading xp-admin-title">				<i class="fa fa-pencil-square-o fa-4x xp-admin-title--icon"></i> <span>Edit Posts</span>				<button class="btn btn-success btn-circle btn-xl fa fa-download pull-right" ng-click="edit.updatePost()" ng-disabled="!form.$valid"></button>			</div>			<form name="form" novalidate style="padding:20px;">				<div class="row">					<div class="col-xs-12 xp-editor-buttons">						<div class="btn btn-success btn-circle" ng-click="edit.togglePreview()" ><i class="fa" ng-class="{\'fa-eye\':edit.previewVisible,\'fa-code\':!edit.previewVisible}"></i></div>						<div class="btn btn-success btn-circle" ng-click="edit.setStyle(\'b\')" ><i class="fa fa-bold"></i></div>						<div class="btn btn-success btn-circle" ng-click="edit.setStyle(\'i\')" ><i class="fa fa-italic"></i></div>						<div class="btn btn-success btn-circle" ng-click="edit.setStyle(\'q\')" ><i class="fa fa-quote-left"></i></div>						<div class="btn btn-success btn-circle" ng-click="edit.setStyle(\'o\')" ><i class="fa fa-list-ol"></i></div>						<div class="btn btn-success btn-circle" ng-click="edit.setStyle(\'u\')" ><i class="fa fa-list-ul"></i></div>						<div class="btn btn-success btn-circle" ng-click="edit.setStyle(\'h\')" ><i class="fa fa-ellipsis-h"></i></div>						<div class="btn btn-success btn-circle" ng-click="edit.insertImage()" ><i class="fa fa-picture-o"></i></div>					</div>				</div>				<div class="row">					<div class="col-xs-8">						<div ng-show="!edit.previewVisible" ui-ace="{showGutter: true, mode:\'markdown\', theme:\'tomorrow_night\',onLoad:aceLoaded}" ng-model="edit.post.content"></div>						<div ng-show="edit.previewVisible" btf-markdown="edit.post.content" class="markdown" style="overflow: scroll; height:800px; padding: 40px;border: 1px solid #ddd;"></div>					</div>					<div class="col-xs-4">						<!-- /.panel -->						<div class="panel panel-default">							<div class="panel-heading">								<i class="fa fa-bookmark-o"></i> Meta								<div class="pull-right"><!-- <input name="published" type="checkbox" value=""> Published --></div>							</div>							<!-- /.panel-heading -->							<div class="panel-body">								<div class="row">									<div class="col-xs-12">										<form name="form">											<div class="form-group" ng-class="{\'has-error\':form.date.$error.required}">												<label>Date</label>												<input name="date" class="form-control" placeholder="YYYY-MM-DD	" ng-model="edit.post.date" type="text" required>											</div>											<div class="form-group" ng-class="{\'has-error\':form.title.$error.required}">												<label>Title</label>												<input name="title" class="form-control" placeholder="Post Title" ng-model="edit.post.title" required>											</div>											<div class="form-group">												<label>Description</label>												<textarea name="description" class="form-control" rows="3" ng-model="edit.post.description"></textarea>											</div>											<div class="form-group">												<label>Categories</label>												<input class="form-control" placeholder="Categories" ng-model="edit.post.categories" ng-list>											</div>										</form>									</div>								</div>							</div>						</div>						<div class="panel panel-default">							<div class="panel-heading">								<i class="fa fa-picture-o"></i> Post Header Image							</div>							<!-- /.panel-heading -->							<div class="panel-body">								<div class="row">									<div class="col-xs-2 text-center">										<a style="margin-bottom:10px" ng-click="edit.pickHeader()" class="btn btn-info btn-circle btn-lg fa fa-folder-open xp-btn-lg-icon"></a>										<a ng-show="edit.hasHeadImage" style="margin-bottom:10px" ng-click="edit.clearHeader()" class="btn btn-danger btn-circle btn-lg fa fa-flash xp-btn-lg-icon"></a>									</div>									<div class="col-xs-10">										<div ng-show="edit.hasHeadImage" class="thumbnail">											<div ng-cloak class="xp-gallery-thumbnail" ng-style="{\'background-image\':\'url(\'+edit.post.image+\')\' }" style="height:250px;"><img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" width="100%" height="100%"></div>										</div>									</div>								</div>							</div>						</div>					</div>				</div>			</form>		</div>	</div></div>';
})(EditPostView || (EditPostView = {}));
var ListPostView;
(function (ListPostView) {
    ListPostView.html = '<!-- POSTS --><div class="row">	<div class="col-lg-12 xp-admin--page">		<!-- /.panel -->		<div class="panel panel-default">			<div class="panel-heading xp-admin-title">				<i class="fa fa-file-text-o fa-4x xp-admin-title--icon"></i> <span>Posts</span>			</div>			<!-- /.panel-heading -->			<div class="panel-body">				<div class="row">					<div class="col-lg-12">						<div class="table-responsive">							<table class="table">								<thead>								<tr>									<th><i class="fa fa-clock-o"></i> DATE </th>									<th><i class="fa fa-text-width"></i> TITLE</th>									<th><i class="fa fa-tags"></i> CATEGORIES</th>									<th><i class="fa fa-align-justify"></i> DESCRIPTION</th>									<th></th>								</tr>								</thead>								<tbody>								<tr ng-repeat="(key,post) in list.posts | toArray | orderBy:\'-date\' ">									<td class="text-success">{{post.date}}</td>									<td>{{post.title}}</td>									<td>{{post.categories.join(\', \')}}</td>									<td>{{post.description}}</td>									<td style="text-align: right">										<a ng-href="#/edit/{{post.file.replace(\'./posts/\',\'\')}}" type="button" class="btn btn-success btn-circle btn-lg"><i class="fa fa-pencil"></i></a>										<a type="button" class="btn btn-danger btn-circle btn-lg" ng-click="list.deletePost( post.file )"><i class="fa fa-trash-o"></i></a>									</td>								</tr>								</tbody>							</table>						</div>						<!-- /.table-responsive -->					</div>				</div>				<!-- /.row -->			</div>			<!-- /.panel-body -->		</div>		<!-- /.panel -->	</div></div>';
})(ListPostView || (ListPostView = {}));
var GalleryPicker;
(function (GalleryPicker) {
    GalleryPicker.html = '<div class="modal" ng-show="gallery.visible">	<div class="modal-dialog xp-dialog-gallery">		<div class="modal-content xp-dialog-gallery-content">			<div class="modal-header">				<button type="button" class="close" aria-hidden="true" ng-click="gallery.toggleGalleryPicker()">×</button>				<h4 class="modal-title" id="myModalLabel">Media library items</h4>			</div>			<div class="modal-body xp-dialog-gallery-body">				<div class="row">					<div class="col-md-12">						<h4><span class="fa fa-folder-open"></span>/{{gallery.folderPath.join(\'/\')}}</h4>					</div>				</div>				<div class="row">					<div class="col-md-2 text-center" file-dropzone="[image/png, image/jpeg, image/gif]" on-drop="gallery.onDrop(data)" file="gallery.uploadImage" file-name="gallery.uploadImageName" data-max-file-size="3">						<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" width="100%" height="100%">						<div class="xp-dialog-gallery-folder-container">							<div class="xp-dialog-gallery-folder">								<div class="fa fa-cloud-download fa-5x"></div>								Drop Files Here{{ gallery.uploadImageName }}							</div>						</div>					</div>					<div class="col-md-2 text-center" ng-if="gallery.folderDepth.length!=0"  ng-click="gallery.folderUp()" >						<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" width="100%" height="100%">						<div class="xp-dialog-gallery-folder-container">							<div class="xp-dialog-gallery-folder">								<div class="fa fa-arrow-circle-up fa-5x"></div>							</div>						</div>					</div>					<div class="col-md-2" ng-repeat="file in gallery.imageNode" >						<div class="thumbnail" ng-if="file.type==\'folder\'" ng-click="gallery.showFolder(file)">							<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" width="100%" height="100%">								<div class="xp-dialog-gallery-folder">									<div class="fa fa-folder fa-5x"></div>									{{file.name}}								</div>						</div>						<div class="thumbnail" ng-if="file.type==\'file\'">							<div class="xp-gallery-thumbnail" style="background-image: url(\'{{file.path.replace(\'./src/images\',\'\')}}\')" ng-if="gallery.isMediaFile(file)" ng-click="gallery.selectImage(file.path)"><img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" width="100%" height="100%"></div>						</div>					</div>				</div>			</div>			<div class="modal-footer">				<button type="button" class="btn btn-default" ng-click="gallery.toggleGalleryPicker()">Close</button>			</div>		</div>	</div></div>';
})(GalleryPicker || (GalleryPicker = {}));
var xp;
(function (xp) {
    (function (mdposteditor) {
        (function (services) {
            var GalleryPickerController = xp.mdposteditor.controllers.GalleryPickerController;
            var GalleryPickerService = (function () {
                function GalleryPickerService($q, messageBus) {
                    this.$q = $q;
                    this.messageBus = messageBus;
                }
                GalleryPickerService.prototype.pickFile = function () {
                    var deferred = this.$q.defer();
                    this.messageBus.emit(GalleryPickerController.PICK, deferred);
                    return deferred.promise;
                };
                GalleryPickerService.$inject = [
                    mdposteditor.DI.$q,
                    mdposteditor.DI.MessageBus
                ];
                return GalleryPickerService;
            })();
            services.GalleryPickerService = GalleryPickerService;
        })(mdposteditor.services || (mdposteditor.services = {}));
        var services = mdposteditor.services;
    })(xp.mdposteditor || (xp.mdposteditor = {}));
    var mdposteditor = xp.mdposteditor;
})(xp || (xp = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};

var xp;
(function (xp) {
    (function (mdposteditor) {
        var AppBase = io.xperiments.angularjs.AppBase;
        var DI = xp.mdposteditor.DI;
        var App = (function (_super) {
            __extends(App, _super);
            function App() {
                _super.apply(this, arguments);
            }
            App.prototype.boot = function () {
                this.disableLiveReload();

                this.wireServices(xp.mdposteditor.services);
                this.wireControllers(xp.mdposteditor.controllers);
                this.wireDirectives(xp.mdposteditor.directives);
                this.wireFilters(xp.mdposteditor.filters);
                this.config(xp.mdposteditor.config);
            };

            App.prototype.disableLiveReload = function () {
                if (window.LiveReload) {
                    window.LiveReload.performReload = function (message) {
                    };
                } else {
                    setTimeout(function () {
                        return window.LiveReload.performReload = function (message) {
                        };
                    }, 2000);
                }
            };
            return App;
        })(AppBase);
        mdposteditor.App = App;
        (function (App) {
            new App("mdposteditor", [
                DI.ngRoute,
                DI.ngSanitize,
                DI.markdown,
                DI.uiAce
            ]);
        })(mdposteditor.App || (mdposteditor.App = {}));
        var App = mdposteditor.App;
    })(xp.mdposteditor || (xp.mdposteditor = {}));
    var mdposteditor = xp.mdposteditor;
})(xp || (xp = {}));
