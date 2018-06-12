define([
  'coreJS/adapt'
],function(Adapt) {

  Adapt.on('questionView:showFeedback', function(view) {

    var alertObject = {
      title: view.model.get("feedbackTitle"),
      body: view.model.get("feedbackMessage")
    };

    var attributes = {};
    var classes = [];

    if (view.model.has('_isCorrect')) {
      // Attach specific classes so that feedback can be styled.
      if (view.model.get('_isCorrect')) {
        classes.push('tutor--correct');
      } else {
        if (view.model.has('_isAtLeastOneCorrectSelection')) {
          // Partially correct feedback is an option.
          if (view.model.get('_isAtLeastOneCorrectSelection')) {
            classes.push('tutor--partially-correct');
          } else {
            classes.push('tutor--incorrect');
          }
        } else {
          classes.push('tutor--incorrect');
        }
      }
    }

    // Add the extension/component type which triggered this.
    if (view.model.has('_component')) {
      classes.push('tutor--component-' + view.model.get('_component'));
    } else if (view.model.has('_extension')) {
      classes.push('tutor--extension-' + view.model.get('_extension'));
    }

    // Add the _id property as attribute.
    attributes['data-adapt-id'] = view.model.get('_id');

    alertObject._classes = classes.join(' ');
    alertObject._attributes = attributes;

    Adapt.once("notify:closed", function() {
      Adapt.trigger("tutor:closed", view, alertObject);
    });

    Adapt.trigger('notify:popup', alertObject);

    Adapt.trigger('tutor:opened', view, alertObject);

  });

});
