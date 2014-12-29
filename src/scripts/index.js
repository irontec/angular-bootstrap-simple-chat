(function() {
  'use strict';

  angular.module('irontec.simpleChat', ['luegg.directives']);

  angular.module('irontec.simpleChat').directive('irontecSimpleChat', SimpleChat);

  function SimpleChat() {

    var chatTemplate =
    '<div class="row chat-window col-xs-5 col-md-3" ng-class="customClass" id="chat-window-1" style="margin-left:10px;">' +
    '<div class="col-xs-12 col-md-12">' +
    '<div class="panel panel-default">' +
    '<div class="panel-heading top-bar">' +
    '<div class="col-md-8 col-xs-8">' +
    '<h3 class="panel-title"><span class="glyphicon glyphicon-comment"></span> {{vm.title}}</h3>' +
    '</div>' +
    '<div class="col-md-4 col-xs-4" style="text-align: right;">' +
    '<span id="minim-chat-window" class="glyphicon" ng-class="vm.chatButtonClass" ng-click="vm.toggle()"></span>' +
    '</div>' +
    '</div>' +
    '<div class="panel-body msg-container-base" ng-style="vm.panelStyle" scroll-glue>' +
    '<div class="row msg-container" ng-repeat="message in vm.messages">' +
    '<div class="col-md-12 col-xs-12">' +
    '<div class="messages msg-sent">' +
    '<p>{{message.content}}</p>' +
    '<strong>{{message.username}}</strong>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '<div class="panel-footer">' +
    '<form style="display:inherit" ng-submit="vm.submitFunction(vm.writingMessage, vm.username)">' +
    '<div class="input-group" >' +
    '<input id="btn-input" type="text" class="form-control input-sm chat-input" placeholder="{{vm.inputPlaceholderText}}" ng-model="vm.writingMessage" />' +
    '<span class="input-group-btn">' +
    '<input type="submit" class="btn btn-irontec btn-sm" value="{{vm.submitButtonText}}" />' +
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
        inputPlaceholderText: '@',
        submitButtonText: '@',
        title: '@',
        customClass: '@',
        submitFunction: '&'
      },
      link: link,
      controller: ChatCtrl,
      controllerAs: 'vm'
    };

    function link(scope) {
      if(!scope.inputPlaceholderText) {
        scope.inputPlaceholderText = 'Write your message here...';

      }

      if(!scope.submitButtonText || scope.submitButtonText === '') {
        scope.submitButtonText = 'Send';
      }

      if(!scope.title) {
        scope.title = 'Chat';
      }
    }

    return directive;
  }

  ChatCtrl.$inject = ['$scope'];

  function ChatCtrl($scope) {
    var vm = this;
    var isHidden = false;

    vm.messages = $scope.messages;
    vm.username = $scope.username;
    vm.inputPlaceholderText = $scope.inputPlaceholderText;
    vm.submitButtonText = $scope.submitButtonText;
    vm.title = $scope.title;
    vm.customClass = $scope.customClass;
    vm.writingMessage = '';
    vm.submitFunction = $scope.submitFunction();

    vm.panelStyle = {'display': 'block'};
    vm.chatButtonClass= 'glyphicon-minus icon_minim';


    vm.toggle = toggle;

    function toggle() {
      if(isHidden) {
        vm.chatButtonClass = 'glyphicon-minus icon_minim';
        vm.panelStyle = {'display': 'block'};
        isHidden = false;
      } else {
        vm.chatButtonClass = 'glyphicon-plus icon_minim';
        vm.panelStyle = {'display': 'none'};
        isHidden = true;
      }

    }

  }


})();
