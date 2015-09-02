(function() {
	'use strict';

	angular.module('irontec.simpleChat', []);
	angular.module('irontec.simpleChat').directive('irontecSimpleChat', ['$timeout', SimpleChat]);

	function SimpleChat($timeout) {
		var chatTemplate =
			'<div ng-show="visible" class="row chat-window col-xs-5 col-md-3 {{vm.theme}}" ng-class="{minimized: vm.isHidden}">' +
			    '<div class="col-xs-12 col-md-12">' +
			        '<div class="panel">' +
			            '<div class="panel-heading chat-top-bar">' +
				            '<div class="col-md-8 col-xs-8">' +
				                '<h3 class="panel-title"><span class="fa fa-comment-o"></span> {{vm.title}}</h3>' +
				            '</div>' +
				            '<div class="col-md-4 col-xs-4 window-actions" style="text-align: right;">' +
				                '<span class="fa" ng-class="vm.chatButtonClass" ng-click="vm.toggle()"></span>' +
				                '<span class="fa fa-close" ng-click="vm.close()"></span>' +
			                '</div>' +
			            '</div>' +
						'<div class="panel-body msg-container-base" ng-style="vm.panelStyle">' +
							'<div class="row msg-container" ng-repeat="message in vm.messages" ng-init="selfAuthored = vm.myUserId == message.fromUserId">' +
			'<div class="col-md-12 col-xs-12">' +
									'<div class="chat-msg" ng-class="{\'chat-msg-sent\': selfAuthored, \'chat-msg-recieved\': !selfAuthored}">' +
										'<span class="hide">myUserId:{{vm.myUserId}}</span>' +
										'<img ng-if="message.imageUrl" class="profile" ng-class="{\'pull-right\': selfAuthored, \'pull-left\': !selfAuthored}" ng-src="{{message.imageUrl}}" />' +
										'<p>{{message.content}}</p>' +
										'<div class="chat-msg-author">' +
											'<strong>{{message.username}}</strong>&nbsp;' +
											'<span class="date">{{message.date|date:\'hh:mm:a\'}}</span>' +
										'</div>' +
									'</div>' +
								'</div>' +
							'</div>' +
						'</div>' +
						'<div class="panel-footer chat-bottom-bar">' +
							'<form style="display:inherit" ng-submit="vm.submitFunction()">' +
								'<div class="input-group" >' +
									'<input type="text" class="form-control input-sm chat-input" placeholder="{{vm.inputPlaceholderText}}" ng-model="vm.writingMessage" />' +
									'<span class="input-group-btn">' +
										'<input type="submit" class="btn btn-sm chat-submit-button" value="{{vm.submitButtonText}}" />' +
									'</span>' +
								'</div>' +
							'</form>' +
						'</div>' +
					'</div>' +
				'</div>' +
			'</div>';

		var directive = {
			restrict: 'EA',
			template: chatTemplate,
			replace: true,
			scope: {
				messages: '=',
				username: '=',
				myUserId: '=',
				inputPlaceholderText: '@',
				submitButtonText: '@',
				title: '@',
				theme: '@',
				submitFunction: '&',
				visible: '=',
				infiniteScroll: '&'
			},
			link: link,
			controller: ChatCtrl,
			controllerAs: 'vm'
		};

		function link(scope, element) {
			if (!scope.inputPlaceholderText) {
				scope.inputPlaceholderText = 'Write your message here...';

			}

			if (!scope.submitButtonText || scope.submitButtonText === '') {
				scope.submitButtonText = 'Send';
			}

			if (!scope.title) {
				scope.title = 'Chat';
			}

			scope.$msgContainer = $('.msg-container-base'); // BS angular $el jQuery lite won't work for scrolling
			scope.$chatInput = $(element).find('.chat-input');

			var elWindow = scope.$msgContainer[0];
			scope.$msgContainer.bind('scroll', _.throttle(function() {
				var scrollHeight = elWindow.scrollHeight;
				if (elWindow.scrollTop <= 10) {
					scope.historyLoading = true; // disable jump to bottom
					scope.$apply(scope.infiniteScroll);
					$timeout(function() {
						scope.historyLoading = false;
						if (scrollHeight !== elWindow.scrollHeight) // don't scroll down if nothing new added
							scope.$msgContainer.scrollTop(360); // scroll down for loading 4 messages
					}, 150);
				}
			}, 300));
		}

		return directive;
	}

	ChatCtrl.$inject = ['$scope', '$timeout'];

	function ChatCtrl($scope, $timeout) {
		var vm = this;

        vm.isHidden = false;
		vm.messages = $scope.messages;
		vm.username = $scope.username;
		vm.myUserId = $scope.myUserId;
		vm.inputPlaceholderText = $scope.inputPlaceholderText;
		vm.submitButtonText = $scope.submitButtonText;
		vm.title = $scope.title;
		vm.theme = 'chat-th-' + $scope.theme;
		vm.writingMessage = '';
		vm.panelStyle = {'display': 'block'};
		vm.chatButtonClass= 'fa-angle-double-down icon_minim';

		vm.toggle = toggle;
		vm.close = close;
		vm.submitFunction = submitFunction;

		function submitFunction() {
			$scope.submitFunction()(vm.writingMessage, vm.username);
			vm.writingMessage = '';
			scrollToBottom();
		}

		$scope.$watch('visible', function() { // make sure scroll to bottom on visibility change w/ history items
			scrollToBottom();
			$timeout(function() {
				$scope.$chatInput.focus();
			}, 250);
		});
		$scope.$watch('messages.length', function() {
			if (!$scope.historyLoading) scrollToBottom(); // don't scrollToBottom if just loading history
		});

		function scrollToBottom() {
			$timeout(function() { // use $timeout so it runs after digest so new height will be included
				$scope.$msgContainer.scrollTop($scope.$msgContainer[0].scrollHeight);
			}, 200, false);
		}

		function close() {
			$scope.visible = false;
		}

		function toggle() {
			if(vm.isHidden) {
				vm.chatButtonClass = 'fa-angle-double-down icon_minim';
				vm.panelStyle = {'display': 'block'};
				vm.isHidden = false;
				scrollToBottom();
			} else {
				vm.chatButtonClass = 'fa-expand icon_minim';
				vm.panelStyle = {'display': 'none'};
				vm.isHidden = true;
			}
		}
	}
})();
