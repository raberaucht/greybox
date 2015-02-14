/**
 * DisplayDetail 
 *
 * - slides out a detail representation of an element 
 * - below a reference element
 * - when a trigger element is clicked
 *
 * ToDo:
 * - make code work for several trigger/detail pairs
 * - clean up code
 */

$(document).ready(function(e) {
  
  $('.DisplayDetail-detail').hide();

  $('.DisplayDetail-trigger').click(function() {
    $(this).next('.DisplayDetail-detail').slideToggle(500)
  });

});
