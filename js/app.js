angular.module('website', ['ngAnimate', 'firebase', 'ui.bootstrap', 'kendo.directives'])
    .constant('FIREBASE_URI', 'https://dbs-tradeshow.firebaseio.com/')
    .controller('MainCtrl', ['$scope', 'AttendeesService', 'PrizeService', function ($scope, AttendeesService, PrizeService) {
        $scope.message = null;
        $scope.loaded = false;

        $scope.pin = {
            first: '',
            second: '',
            third: '',
            fourth: ''
        };

        $scope.attendees = AttendeesService.getAttendees();

        // optimize
        $scope._prizes = [];
        $scope.outOfPrizes = true;
        $scope.prizes = PrizeService.getPrizes();
        $scope.prizes.$on('change', function() {
            $scope.outOfPrizes = true;

            angular.forEach($scope.prizes, function (prize) {
                if (typeof prize !== 'function') {
                    if(prize.claimed < prize.count) {
                        $scope.outOfPrizes = false;
                    }

                    $scope._prizes.push(prize);
                }
            });
        });

        $scope.attendees.$on('loaded', function(){
            $scope.loaded = true;

            angular.forEach($scope.attendees, function (attendee, id) {
                attendee._id = id;
            });
        });

        $scope.currentAttendee = null;
        $scope.currentPrize = null;

        $scope.pages = {
            'pin': {  },
            'info': {  },
            'prize': {  }
        };

        $scope.currentPage = 'pin';
        $scope.page = $scope.pages['pin'];
        $scope.isInTransit = false;

        // Made it work... now make it right
        $scope.getPrize = function () {
            if($scope.outOfPrizes) {
                return 'thumb';
            }

            var selectedPrize = $scope._prizes[Math.floor(Math.random() * $scope._prizes.length)];

            if(selectedPrize.claimed < selectedPrize.count) {
                selectedPrize.claimed++;
                PrizeService.updatePrizes();

                return selectedPrize.name;
            } else {
                return $scope.getPrize();
            }
        };

        $scope.setCurrentPage = function (page) {
            if ($scope.currentPage !== page) {
                $scope.page = $scope.pages[page];
                $scope.currentPage = page;
                $scope.isInTransit = true;
            }
        };

        $scope.isCurrentPage = function (page) {
            return $scope.currentPage === page;
        };

        $scope.$on('bgTransitionComplete', function () {
            $scope.isInTransit = false;
        });

        $scope.setCurrentAttendee = function () {
            var currentPin = $scope.pin.first + $scope.pin.second + $scope.pin.third + $scope.pin.fourth;

            angular.forEach($scope.attendees, function (attendee) {
                if (attendee.code == currentPin) {
                    $scope.currentAttendee = attendee;
                }
            });

            $scope.message = null;

            if ($scope.currentAttendee) {
                if(typeof $scope.currentAttendee.prize == 'undefined' || $scope.currentAttendee.prize == '') {
                    var prize = ($scope.currentAttendee.code === 5030) ? 'ipad' : $scope.getPrize();

                    $scope.currentAttendee.prize = prize;

                    AttendeesService.updateAttendee($scope.currentAttendee);
                } else {
                    $scope.message = "Lucky you! You have already won a prize!";
                }
                $scope.verifyInfo();
            } else {
                $scope.message = 'Uh oh! No attendee found the code entered';
            }
        };

        $scope.verifyInfo = function () {
            console.log('ON VERIFY', $scope.currentAttendee);

            $scope.setCurrentPage('info');
        };

        $scope.claimPrize = function () {
            console.log('ON PRIZE', $scope.currentAttendee);
            AttendeesService.updateAttendee($scope.currentAttendee);
            $scope.setCurrentPage('prize');
        };

        $scope.reset = function () {
            $scope.pin = {
                first: '',
                second: '',
                third: '',
                fourth: ''
            };

            $scope.message = null;
            $scope.currentAttendee = null;
            $scope.currentPrize = null;
        };
    }])
    .factory('AttendeesService', ['$firebase', 'FIREBASE_URI', function ($firebase, FIREBASE_URI) {
        var attendeesRef = new Firebase(FIREBASE_URI + 'attendees');
        var attendees = $firebase(attendeesRef);

        var getAttendees = function () {
            return attendees;
        };

        var updateAttendees = function () {
            attendees.$save();
        };

        var updateAttendee = function (attendee) {
            attendees[attendee._id] = attendee;

            console.log('TO SERVER', attendees[attendee._id]);

            attendees.$save(attendee._id)
        };

        return {
            getAttendees: getAttendees,
            updateAttendees: updateAttendees,
            updateAttendee: updateAttendee
        }
    }])
    .controller('AdminCtrl', ['$scope', 'PrizeService', function ($scope, PrizeService) {
        $scope.newPrize = { name: '', count: 0, claimed: 0 };
        $scope.currentPrize = null;

        $scope.prizes = PrizeService.getPrizes();

        $scope.addPrize = function () {
            PrizeService.addPrize(angular.copy($scope.newPrize));
            $scope.newPrize = { name: '', count: 0, claimed: 0 };
        };

        $scope.updatePrize = function (prize) {
            PrizeService.updatePrize(prize);
        };

        $scope.removePrize = function (prize) {
            PrizeService.removePrize(prize);
        };
    }])
    .factory('PrizeService', ['$firebase', 'FIREBASE_URI', function ($firebase, FIREBASE_URI) {
        var ref = new Firebase(FIREBASE_URI + 'prizes');
        var prizes = $firebase(ref);

        var getPrizes = function () {
            return prizes;
        }

        var addPrize = function (prize) {
            prizes.$add(prize);
        };

        var updatePrize = function (prize) {
            prizes.$save(prize);
        };

        var removePrize = function (prize) {
            prizes.$remove(prize);
        };

        var updatePrizes = function () {
            prizes.$save();
        }

        return {
            getPrizes: getPrizes,
            updatePrizes: updatePrizes,
            addPrize: addPrize,
            updatePrize: updatePrize,
            removePrize: removePrize
        }
    }])
    .directive('pinPad', function () {
        return{
            link: function (scope, element, attrs) {
                $('.pin').autotab({ maxlength: 1 });
            }
        }
    })
    .directive('prize', function($timeout) {
        var linker = function (scope, element, attrs) {
            var originalPrize = scope.currentPrize;
            var images = ['boat', 'car', 'chain', 'cloth', 'ipad', 'purse', 'usb', 'thumb',
                'boat', 'car', 'chain', 'cloth', 'ipad', 'purse', 'usb', 'thumb',
                'boat', 'car', 'chain', 'cloth', 'ipad', 'purse', 'usb', 'thumb',
                'boat', 'car', 'chain', 'cloth', 'ipad', 'purse', 'usb', 'thumb',
                'boat', 'car', 'chain', 'cloth', 'ipad', 'purse', 'usb', 'thumb'];

            var currentIndex = 0;
            scope.currentPrize = images[currentIndex];

            var cycleImage = function() {
                if(currentIndex < images.length - 1) {
                    scope.currentPrize = images[currentIndex];
                    currentIndex++;
                    $timeout(cycleImage, currentIndex * 10);
                } else {
                    currentIndex = 0;
                    scope.currentPrize = originalPrize;
                }
            };

            cycleImage();
        };

        return {
            link: linker,
            template: '<div class="prize"><img ng-src="images/{{currentPrize}}.jpg"/></div>',
            replace: true,
            restrict: 'E',
            scope: {
                currentPrize:'='
            }
        }
    })
    .animation('.bg-animation', function ($window, $rootScope) {
        return {
            enter: function (element, done) {
                TweenMax.fromTo(element[0], 0.5, { left: $window.innerWidth}, {left: 0, onComplete: function () {
                    $rootScope.$apply(function () {
                        $rootScope.$broadcast('bgTransitionComplete');
                    });
                    done();
                }});
            },

            leave: function (element, done) {
                TweenMax.to(element[0], 0.5, {left: -$window.innerWidth, onComplete: done});
            }
        };
    });