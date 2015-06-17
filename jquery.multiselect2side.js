/*
 * multiselect2side jQuery plugin
 *
 * Copyright (c) 2010 Giovanni Casassa (senamion.com - senamion.it)
 *
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://www.senamion.com
 *
 */

(function($)
{
	// SORT INTERNAL
	function internalTextSort(a, b) {
		var compA = $(a).text().toUpperCase();
		var compB = $(b).text().toUpperCase();
		return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
	}

	function internalIdSort(a, b) {
		var idA = $(a).attr('id');
		var idB = $(b).attr('id');
		var compA;
		var compB;
		if (!isNaN(idA) && !isNaN(idB))
		{
			compA = parseInt($(a).attr('id'));
			compB = parseInt($(b).attr('id'));
		}
		else
		{
			compA = idA;
			compB = idB;
		}
		return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
	}

	function getDivUpDown(config)
	{
		// UP AND DOWN
		var divUpDown =
			"<div class='ms2side__updown'>" +
				"<p class='SelSort' title='Sort'>" + config.labelSort + "</p>" +
				"<p class='MoveTop' title='Move on top selected option'>" + config.labelTop + "</p>" +
				"<p class='MoveUp' title='Move up selected option'>" + config.labelUp + "</p>" +
				"<p class='MoveDown' title='Move down selected option'>" + config.labelDown + "</p>" +
				"<p class='MoveBottom' title='Move on bottom selected option'>" + config.labelBottom + "</p>" +
			"</div>";
		return divUpDown;
	}

	function getSelectionControls(config)
	{
		var controls = '';
		if (config.horizontal)
		{
			if (config.selectedPosition == 'right')
			{
				controls =
					"<p class='AddOne' title='Add Selected'><img src='/img/BTNArrowRight.png' border='0' /></p>" +
					"<p class='AddAll' title='Add All'><img src='/img/BTNDoubleArrowRight.png' border='0' /></p>" +
					"<p class='RemoveOne' title='Remove Selected'><img src='/img/BTNArrowLeft.png' border='0' /></p>" +
					"<p class='RemoveAll' title='Remove All'><img src='/img/BTNDoubleArrowLeft.png' border='0' /></p>";
			}
			else
			{
				controls =
					"<p class='AddOne' title='Add Selected'>&<img src='/img/BTNArrowLeft.png' border='0' /></p>" +
					"<p class='AddAll' title='Add All'><img src='/img/BTNDoubleArrowLeft.png' border='0' /></p>" +
					"<p class='RemoveOne' title='Remove Selected'><img src='/img/BTNArrowRight.png' border='0' /></p>" +
					"<p class='RemoveAll' title='Remove All'><img src='/img/BTNDoubleArrowRight.png' border='0' /></p>";
			}
		}
		else
		{
			if (config.selectedPosition == 'right')
			{
				controls =
					"<td><p class='AddOne' title='Add Selected'><img src='/img/BTNDownArrow.png' border='0' /></p></td>" +
					"<td><p class='AddAll' title='Add All'><img src='/img/BTNdoubledownArrow.png' border='0' /></p></td>" +
					"<td><p class='RemoveOne' title='Remove Selected'><img src='/img/BTNUpArrow.png' border='0' /></p></td>" +
					"<td><p class='RemoveAll' title='Remove All'><img src='/img/BTNDoubleUpArrow.png' border='0' /></p></td>";
			}
			else
			{
				controls =
					"<td><p class='AddOne' title='Add Selected'><img src='/img/BTNUpArrow.png' border='0' /></p></td>" +
					"<td><p class='AddAll' title='Add All'><img src='/img/BTNDoubleUpArrow.png' border='0' /></p></td>" +
					"<td><p class='RemoveOne' title='Remove Selected'><img src='/img/BTNDownArrow.png' border='0' /></p></td>" +
					"<td><p class='RemoveAll' title='Remove All'><img src='/img/BTNdoubledownArrow.png' border='0' /></p></td>";
			}
		}

		return controls;
	}

	function getHorizontalTwoSidedSelectHtml($underlyingSelect, config, leftSelectLabel, rightSelectLabel, size)
	{
		var divUpDown = getDivUpDown(config);

		var htmlToAdd =
			"<div class='ms2side__div'>" +
				((config.selectedPosition != 'right' && config.moveOptions) ? divUpDown : "") +
				"<div class='ms2side__select'>" +
					getSelectHeader(config, 'left') +
					getSearchbox(config, 'left') +
					getSelectHtml($underlyingSelect, config, leftSelectLabel, size, 'left') +
				"</div>" +
				"<div class='ms2side__options'>" +
					getSelectionControls(config) +
				"</div>" +
				"<div class='ms2side__select'>" +
					getSelectHeader(config, 'right') +
					getSearchbox(config, 'right') +
					getSelectHtml($underlyingSelect, config, rightSelectLabel, size, 'right') +
				"</div>" +
				((config.selectedPosition == 'right' && config.moveOptions) ? divUpDown : "") +
			"</div>";
		return htmlToAdd;
	}

	function getSelectHeader(config, targetPosition) {

		var searchTogglingElements = '';
		if (config.selectedPosition != targetPosition)
		{
			if (config.optGroupSearch)
			{
				searchTogglingElements += '<span class="ui-icon ui-icon-lightbulb left toggleOptGroupSearchElements"></span>';
			}

			if (config.search)
			{
				searchTogglingElements += '<span class="ui-icon ui-icon-search left toggleOptionSearchElements"></span>';
			}
		}

		var header =
			"<div class='ms2side__header'>" +
				searchTogglingElements +
				(targetPosition === 'right' ? config.labelRightSide : config.labelLeftSide) +
			"</div>";

		return header;
	}

	function getVerticalTwoSidedSelectHtml($underlyingSelect, config, leftSelectName, rightSelectName, size)
	{
		var divUpDown = getDivUpDown(config);

		var htmlToAdd =
			"<div class='ms2side__div'>" +
				((config.selectedPosition != 'right' && config.moveOptions) ? divUpDown : "") +
				"<div class='ms2side__select'>" +
					getSelectHeader(config, 'left') +
					getSearchbox(config, 'left') +
					getSelectHtml($underlyingSelect, config, leftSelectName, size, 'left') +
				"</div>" +
				"<div class='ms2side__options' style='width:75%;'>" +
					"<table width='100%' border='0' cellspacing='0' cellpadding='0' class='MultiSelectButtonTable'>" +
					"<tr valign='middle'>" +
					getSelectionControls(config) +
					"</tr>" +
					"</table>" +
				"</div>" +
				"<div class='ms2side__select'>" +
					getSelectHeader(config, 'right') +
					getSearchbox(config, 'right') +
					getSelectHtml($underlyingSelect, config, rightSelectName, size, 'right') +
				"</div>" +
				((config.selectedPosition == 'right' && config.moveOptions) ? divUpDown : "") +
			"</div>";
		return htmlToAdd;
	}

	function getSelectHtml($underlyingSelect, config, selectName, size, targetPosition)
	{
		var selectHtml = "<select " +
			"title='" + (targetPosition === 'right' ? config.labelRightSide : config.labelLeftSide) + "' " +
			"name='" + selectName  + "' " +
			"id='" + selectName  + "' " +
			"size='" + size  + "' " +
			"multiple='multiple' >";
		$underlyingSelect.find("option").each(function(index, option) {
			if (option.selected)
			{
				if (config.selectedPosition === targetPosition) {
					selectHtml += '<option id="' + option.id + '" ' +
					'class="' + option.className + '" ' +
					'value="' + option.value + '" ' +
					'>' + option.text + '</option>';
				}
			}
			else
			{
				if (config.selectedPosition !== targetPosition) {
					selectHtml += '<option id="' + option.id + '" ' +
					'class="' + option.className  + '" ' +
					'value="' + option.value + '"' +
					'>' + option.text + '</option>';
				}
			}
		});

		selectHtml += "</select>";
		return selectHtml;
	}

	function getTwoSidedSelectHtml($underlyingSelect, config, leftSelectName, rightSelectName, size) {

		var htmlToAdd;
		if (config.horizontal)
		{
			htmlToAdd = getHorizontalTwoSidedSelectHtml($underlyingSelect, config, leftSelectName, rightSelectName, size);
		}
		else
		{
			htmlToAdd = getVerticalTwoSidedSelectHtml($underlyingSelect, config, leftSelectName, rightSelectName, size);
		}
		return htmlToAdd;
	}

	function getSearchbox(config, targetPosition)
	{
		var searchHtml = "";

		if (config.selectedPosition != targetPosition)
		{
			searchHtml =
				"<div style='display:none; padding-top:1%;' class='optGroupSearchElement'>" +
					"<select class='optGroupSearchSelect'>" +
						"<option value='__null__'  selected>" + config.optGroupSearch + "</option>" +
					"</select> " +
				"</div>";
		}


		if (config.selectedPosition != targetPosition)
		{
			searchHtml +=
				"<div style='display:none; padding-top:1%;' class='optionSearchElement'>" +
					"<input class='optionSearchInput' type='text' placeholder='" + config.search +"'></input>" +
					"<a href='#'> </a>" +
				"</div>";
		}

		return searchHtml;
	}

	function setupSearchCapabilities(config, el, leftSel)
	{
		// SELECT optgroup
		var searchSelect = $();

		// SEARCH INPUT
		var searchInput = el.next().find("input:text");
		var removeFilter = searchInput.next().hide();
		var toid = false;
		var searchV = false;

		// SELECT optgroup - ADD ALL OPTGROUP AS OPTION
		if (config.optGroupSearch != false) {
			var lastOptGroupSearch = false;

			searchSelect = el.next().find("select").eq(0);

			el.children("optgroup").each(function () {
				if (searchSelect.find("[value='" + $(this).attr("label") + "']").size() == 0)
					searchSelect.append("<option value='" + $(this).attr("label") + "'>" + $(this).attr("label") + "</option>");
			});
			searchSelect.change(function () {
				var sEl = $(this);

				if (sEl.val() != lastOptGroupSearch) {

					// IF EXIST SET SEARCH TEXT TO VOID
					if (searchInput.val() != "") {
						clearTimeout(toid);
						removeFilter.hide();
						searchInput.val("");//.trigger('keyup');
						searchV = "";
						// fto();
					}

					setTimeout(function () {
						if (sEl.val() == "__null__") {
							els = el.find("option:not(:selected)");
						}
						else
							els = el.find("optgroup[label='" + sEl.val() + "']").children("option:not(:selected)");

						// REMOVE ORIGINAL ELEMENTS AND ADD OPTION OF OPTGROUP SELECTED
						leftSel.find("option").remove();
						els.each(function () {
							leftSel.append($(this).clone());
						});
						lastOptGroupSearch = sEl.val();
						leftSel.trigger('change');
					}, 100);
				}
			});
		}


		// SEARCH FUNCTION
		var fto = function () {
			var els = leftSel.children();
			var toSearch = el.find("option:not(:selected)");

			// RESET OptGroupSearch
			lastOptGroupSearch = "__null__";
			searchSelect.val("__null__");

			if (searchV == searchInput.val())
				return;

			searchInput
				.addClass("wait")
				.attr("style", '');

			searchV = searchInput.val();

			// A LITTLE TIMEOUT TO VIEW WAIT CLASS ON INPUT ON IE
			setTimeout(function () {
				leftSel.children().remove();
				if (searchV == "") {
					toSearch.clone().appendTo(leftSel).prop("selected", false);
					removeFilter.hide();
				}
				else {
					toSearch.each(function () {
						var myText = $(this).text();

						var find = -1;
						if (config.caseSensitive)
							find = myText.indexOf(searchV);
						else
							find = myText.toUpperCase().indexOf(searchV.toUpperCase());

						if (find != -1)
							$(this).clone().appendTo(leftSel).prop("selected", false);
					});

					if (leftSel.children().length == 0)
						searchInput.css({'border': '1px red solid'});

					removeFilter.show();
					leftSel.trigger('change');
				}
				leftSel.trigger('change');
				searchInput.removeClass("wait");
			}, 5);
		};

		// REMOVE FILTER ON SEARCH FUNCTION
		removeFilter.click(function () {
			clearTimeout(toid);
			searchInput.val("");
			fto();
			return false;
		});

		// ON CHANGE TEXT INPUT
		searchInput.keyup(function () {
			clearTimeout(toid);
			toid = setTimeout(fto, config.delay);
		});

		return searchSelect;
	}

	function ensureSelectedHeightSameAsAvailable()
	{
		var thisDiv = $(this).closest('.ms2side__select');
		var thisDivHeight = thisDiv.prop('offsetHeight');
		var otherDiv = thisDiv.siblings('.ms2side__select');
		otherDiv.css('height', thisDivHeight);
		var otherDivHeaderHeight = otherDiv.find('.ms2side__header').prop('offsetHeight');
		otherDiv.find('select').css('height', thisDivHeight - otherDivHeaderHeight);
	}

	function toggleOptionSearchElementVisibility()
	{
		$(this).closest('.ms2side__div').find('.optionSearchElement').toggle();
		ensureSelectedHeightSameAsAvailable.call(this);
	}

	function toggleOptGroupSearchElementVisibility()
	{
		$(this).closest('.ms2side__div').find('.optGroupSearchElement').toggle();
		ensureSelectedHeightSameAsAvailable.call(this);
	}


	function addTwoSidedSelect (el, config, nameLeftSide, nameRightSide, size) {
		var htmlToAdd = getTwoSidedSelectHtml(el, config, nameLeftSide, nameRightSide, size);
		el.after(htmlToAdd).hide();
		el.parent().find('.toggleOptGroupSearchElements').on('click', toggleOptGroupSearchElementVisibility);
		el.parent().find('.toggleOptionSearchElements').on('click', toggleOptionSearchElementVisibility);
	}

	var methods = {

		hide: function() {
			return this.each(function() {
				$(this).next().hide();
			});
		},
		show: function() {
			return this.each(function() {
				$(this).next().show();
			});
		},
		exists: function() {
			var rval = false;
			this.each(function() {
				if ($(this).data('config') != null) {
					rval = true;
				}
			});
			return rval;
		},

		unload: function() {

			// the this keyword is a jQuery object
			return this.each(function() {

				// the this keyword is a DOM element
				var el = $(this);
				var originalName = el.attr("name");
				if (originalName.indexOf('[') != -1)
					originalName = originalName.substring(0, originalName.indexOf('['));
				if ($('#' + originalName + ' + .ms2side__div').length > 0) {
					$('#' + originalName + ' + .ms2side__div').remove();
					$(this).removeData('options');
				}
			});
		},

		removeOption: function(existingOption) {

			// the this keyword is a jQuery object
			return this.each(function() {

				// the this keyword is a DOM element
				var el = $(this);

				var useOptionIDs = el.data('config').useOptionIDs;

				var allSel = $(this).next().find("select");
				if (useOptionIDs) {
					allSel.find('option[id="' + existingOption + '"]').remove();
					el.find('option[id="' + existingOption + '"]').remove();
				}
				else {
					allSel.find('option[value="' + existingOption + '"]').remove();
					el.find('option[value="' + existingOption + '"]').remove();
				}
				el.trigger('change');
				allSel.trigger('change');
			});
		},

		updateOption: function(existingOption, newOptionText, newOptionValue) {
			// the this keyword is a jQuery object
			return this.each(function() {

				// the this keyword is a DOM element
				var el = $(this);

				var useOptionIDs = el.data('config').useOptionIDs;

				var allSel = el.next().find("select");

				var changedElement = '';
				if (useOptionIDs) {
					changedElement = allSel.find('option[id="' + existingOption + '"]');
				}
				else {
					changedElement = allSel.find('option:contains("' + existingOption + '")');
				}
				changedElement.text(newOptionText);
				changedElement.val(newOptionValue);

				var origElement = '';
				if (useOptionIDs) {
					origElement = el.find('option[id="' + existingOption + '"]');
				}
				else {
					origElement = el.find('option:contains("' + existingOption + '")');
				}
				origElement.text(newOptionText);
				origElement.val(newOptionValue);
			});

		},
		getSelectedOptions: function() {

			var rval = '';

			// the this keyword is a jQuery object
			this.each(function() {

				// the this keyword is a DOM element
				var el = $(this);
				var config = el.data('config');
				var useOptionIDs = config.useOptionIDs;

				var allSel = el.next().find("select");
				var rightSel = (config.selectedPosition == 'right') ? allSel.eq(1) : allSel.eq(0);
				var jqueryObjArray = rightSel.find("option").map(
					function() {
						if (useOptionIDs) {
							return $(this).attr('id');
						}
						else {
							return $(this).val();
						}
					}
				);
				rval = jqueryObjArray.get().join(',');
			});

			return rval;
		},
		getUnselectedOptions: function() {

			var rval = '';

			// the this keyword is a jQuery object
			this.each(function() {

				// the this keyword is a DOM element
				var el = $(this);
				var config = el.data('config');
				var useOptionIDs = config.useOptionIDs;

				var allSel = el.next().find("select");
				var leftSel = (config.selectedPosition == 'right') ? allSel.eq(0) : allSel.eq(1);
				var jqueryObjArray = leftSel.find("option").map(
					function() {
						if (useOptionIDs) {
							return $(this).attr('id');
						}
						else {
							return $(this).val();
						}
					}
				);
				rval = jqueryObjArray.get().join(',');
			});

			return rval;
		},
		setSelectedOptions: function(selectedOptions, unselectedOptions) {

			// the this keyword is a jQuery object
			return this.each(function() {

				// the this keyword is a DOM element
				var el = $(this);
				var originalId = $(this).attr("id");

				var config = el.data('config');
				var useOptionIDs = config.useOptionIDs;
				var allSel = el.next().find("select");
				var leftSel = (config.selectedPosition == 'right') ? allSel.eq(0) : allSel.eq(1);
				var rightSel = (config.selectedPosition == 'right') ? allSel.eq(1) : allSel.eq(0);

				// unselect all
				el.find('option').prop("selected", false);

				var unselectedOptionArray = unselectedOptions.split(",");
				for (var i = unselectedOptionArray.length - 1; i >= 0; i--) {
					if (useOptionIDs) {
						$('#' + originalId + ' option[id="' + unselectedOptionArray[i] + '"]').prop("selected", true).remove().appendTo(el);
					}
					else {
						$('#' + originalId + ' option[value="' + unselectedOptionArray[i] + '"]').prop("selected", true).remove().appendTo(el);
					}
				}

				var selectedOptionArray = selectedOptions.split(",");
				for (var i = 0; i < selectedOptionArray.length; i++) {

					if (useOptionIDs) {
						$('#' + originalId + ' option[id="' + selectedOptionArray[i] + '"]').prop("selected", true).remove().appendTo(el);
					}
					else {
						$('#' + originalId + ' option[value="' + selectedOptionArray[i] + '"]').prop("selected", true).remove().appendTo(el);
					}
				}

				el.multiselect2side('update');
			});
		},
		update: function() {
			// the this keyword is a jQuery object
			return this.each(function() {

				// the this keyword is a DOM element
				var el = $(this);
				el.next().hide();
				var config = el.data('config');

				var allSel = el.next().find("select");
				var leftSel = (config.selectedPosition == 'right') ? allSel.eq(0) : allSel.eq(1);
				var rightSel = (config.selectedPosition == 'right') ? allSel.eq(1) : allSel.eq(0);

				// clear out both lists
				rightSel.children().remove();
				leftSel.children().remove();

				// cause the options in each list to be repopulated based on the
				// source select
				el.find("option:selected").clone().appendTo(rightSel);
				el.find("option:not(:selected)").clone().appendTo(leftSel);
				el.next().show();
			});
		},

		init : function(userConfig) {
			var config = {
				selectedPosition: 'right',
				moveOptions: true,
				labelTop: 'Top',
				labelBottom: 'Bottom',
				labelUp: 'Up',
				labelDown: 'Down',
				labelSort: 'Sort',
				labelLeftSide: 'Available',
				labelRightSide: 'Selected',
				maxSelected: -1,
				useOptionIDs: false,
				autoSort: false,
				autoSortAvailable: false,
				search: false,
				caseSensitive: false,
				delay: 200,
				optGroupSearch: false,
				minSize: 6,
				horizontal: true
			};

			// the this keyword is a jQuery object
			return this.each(function () {

				// the this keyword is a DOM element
				var el = $(this);
				var html = $('html');
				// store the options for later.
				$(this).data('config', config);

				var data = el.data('multiselect2side');

				if (userConfig)
					$.extend(config, userConfig);

				if (!data)
					el.data('multiselect2side', config);

				var originalName = $(this).attr("name");
				if (originalName.indexOf('[') != -1)
					originalName = originalName.substring(0, originalName.indexOf('['));

				var nameRightSide = originalName + "ms2side__dx";
				var nameLeftSide = originalName + "ms2side__sx";
				var size = $(this).attr("size");
				// SIZE MIN
				if (size < config.minSize) {
					$(this).attr("size", "" + config.minSize);
					size = config.minSize;
				}

				// CREATE NEW ELEMENT (AND HIDE IT) AFTER THE HIDDEN ORIGINAL SELECT
				addTwoSidedSelect(el, config, nameLeftSide, nameRightSide, size);
				// ELEMENTS
				var allSel = el.next().children(".ms2side__select").children("select");
				var leftSel = (config.selectedPosition == 'right') ? allSel.eq(0) : allSel.eq(1);
				var rightSel = (config.selectedPosition == 'right') ? allSel.eq(1) : allSel.eq(0);
				// HEIGHT DIV
				var heightDiv = $(".ms2side__select").eq(0).height();

				var searchSelect = setupSearchCapabilities(config, el, leftSel);
				var removeFilter = el.next().find("input:text").next();

				// CENTER MOVE OPTIONS AND UPDOWN OPTIONS
				$(this).next().find('.ms2side__options, .ms2side__updown').each(function () {
					var top = ((heightDiv / 2) - ($(this).height() / 2));
					if (top > 0)
						$(this).css('padding-top', top + 'px');
				});

				// SELECT FIRST LEFT ITEM AND DESELECT IN RIGHT (NOT IN IE6)
				// jQuery browser is removed, check now requires html boilerplate
				// conditions html comments https://github.com/h5bp/html5-boilerplate/blob/v4.3.0/doc/html.md
				if (!(html.hasClass('ie6') || html.hasClass('le-ie7') || html.hasClass('ielte7'))) {
					leftSel.find("option").eq(0).prop("selected", true);
					rightSel.children().prop("selected", false);
				}

				// ON CHANGE SORT SELECTED OPTIONS
				var nLastAutosort = 0;
				if (config.autoSort)
					allSel.change(function () {
						var selectRight = rightSel.find("option");

						if (selectRight.length != nLastAutosort) {
							// SORT SELECTED ELEMENT
							selectRight.sort(config.useOptionIDs ? internalIdSort : internalTextSort);
							// FIRST REMOVE FROM ORIGINAL SELECT
							el.find("option:selected").remove();
							// AFTER ADD ON ORIGINAL AND RIGHT SELECT
							selectRight.each(function () {
								rightSel.append($(this).clone());
								$(this).appendTo(el).prop("selected", true);
							});
							nLastAutosort = selectRight.length;
						}
					});

				// ON CHANGE SORT AVAILABLE OPTIONS (NOT NECESSARY IN ORIGINAL SELECT)
				var nLastAutosortAvailable = 0;
				if (config.autoSortAvailable)
					allSel.change(function () {
						var selectLeft = leftSel.find("option");

						if (selectLeft.length != nLastAutosortAvailable) {
							// SORT SELECTED ELEMENT
							selectLeft.sort(config.useOptionIDs ? internalIdSort : internalTextSort);
							// REMOVE ORIGINAL ELEMENTS AND ADD SORTED
							leftSel.find("option").remove();
							selectLeft.each(function () {
								leftSel.append($(this).clone());
							});
							nLastAutosortAvailable = selectLeft.length;
						}
					});

				// ON CHANGE REFRESH ALL BUTTON STATUS
				allSel.change(function () {
					var div = $(this).parent().parent();
					var selectLeft = leftSel.children();
					var selectRight = rightSel.children();
					var selectedLeft = leftSel.find("option:selected");
					var selectedRight = rightSel.find("option:selected");

					if (selectedLeft.size() == 0 ||
						(config.maxSelected >= 0 && (selectedLeft.size() + selectRight.size()) > config.maxSelected))
						div.find(".AddOne").addClass('ms2side__hide');
					else
						div.find(".AddOne").removeClass('ms2side__hide');

					// FIRST HIDE ALL
					div.find(".RemoveOne, .MoveUp, .MoveDown, .MoveTop, .MoveBottom, .SelSort").addClass('ms2side__hide');
					if (selectRight.size() > 1)
						div.find(".SelSort").removeClass('ms2side__hide');
					if (selectedRight.size() > 0) {
						div.find(".RemoveOne").removeClass('ms2side__hide');
						// ALL SELECTED - NO MOVE
						if (selectedRight.size() < selectRight.size()) {	// FOR NOW (JOE) && selectedRight.size() == 1
							if (selectedRight.val() != selectRight.val())	// FIRST OPTION, NO UP AND TOP BUTTON
								div.find(".MoveUp, .MoveTop").removeClass('ms2side__hide');
							if (selectedRight.last().val() != selectRight.last().val())	// LAST OPTION, NO DOWN AND BOTTOM BUTTON
								div.find(".MoveDown, .MoveBottom").removeClass('ms2side__hide');
						}
					}

					if (selectLeft.size() == 0 ||
						(config.maxSelected >= 0 && selectLeft.size() >= config.maxSelected))
						div.find(".AddAll").addClass('ms2side__hide');
					else
						div.find(".AddAll").removeClass('ms2side__hide');

					if (selectRight.size() == 0)
						div.find(".RemoveAll").addClass('ms2side__hide');
					else
						div.find(".RemoveAll").removeClass('ms2side__hide');
				});

				// DOUBLE CLICK ON LEFT SELECT OPTION
				leftSel.dblclick(function () {
					$(this).find("option:selected").each(function (i, selected) {

						if (config.maxSelected < 0 || rightSel.children().size() < config.maxSelected) {
							$(this).remove().appendTo(rightSel);
							el.find("[value='" + $(selected).val() + "']").remove().appendTo(el).prop("selected", true);
						}
					});
					el.trigger('change');
					$(this).trigger('change');
				});

				// DOUBLE CLICK ON RIGHT SELECT OPTION
				rightSel.dblclick(function () {
					$(this).find("option:selected").each(function (i, selected) {
						$(this).remove().appendTo(leftSel);
						el.find("[value='" + $(selected).val() + "']").prop("selected", false).remove().appendTo(el);
					});
					el.trigger('change');
					$(this).trigger('change');

					// TRIGGER CHANGE AND VALUE NULL FORM OPTGROUP SEARCH (IF EXIST)
					searchSelect.val("__null__").trigger("change");
					// TRIGGER CLICK ON REMOVE FILTER (IF EXIST)
					removeFilter.click();
				});

				// CLICK ON OPTION
				$(this).next().find('.AddOne, .AddAll, .RemoveOne, .RemoveAll').click(function () {
					if (!$(this).hasClass("ms2side__hide")) {
						if ($(this).hasClass("AddOne")) {
							leftSel.find("option:selected").each(function (i, selected) {
								$(this).remove().appendTo(rightSel);
								el.find("[value='" + $(selected).val() + "']").remove().appendTo(el).prop("selected", true);
							});
						}
						else if ($(this).hasClass("AddAll")) {	// ALL SELECTED
							// TEST IF HAVE A FILTER OR A SELECT OPTGROUP
							if (removeFilter.is(":visible") || (searchSelect.length > 0 && searchSelect.val() != "__null__"))
								leftSel.children().each(function (i, selected) {
									$(this).remove().appendTo(rightSel);
									el.find("[value='" + $(selected).val() + "']").remove().appendTo(el).prop("selected", true);
								});
							else {
								leftSel.children().remove().appendTo(rightSel);
								el.find('option').prop("selected", true);
							}
						}
						else if ($(this).hasClass("RemoveOne")) {
							rightSel.find("option:selected").each(function (i, selected) {
								$(this).remove().appendTo(leftSel);
								el.find("[value='" + $(selected).val() + "']").remove().appendTo(el).prop("selected", false);
							});
							// TRIGGER CLICK ON REMOVE FILTER (IF EXIST)
							removeFilter.click();
							// TRIGGER CHANGE AND VALUE NULL FORM OPTGROUP SEARCH (IF EXIST)
							searchSelect.val("__null__").trigger("change");
						}
						else if ($(this).hasClass("RemoveAll")) {	// ALL REMOVED
							rightSel.children().appendTo(leftSel);
							rightSel.children().remove();
							el.find('option').prop("selected", false);
							//el.children().removeAttr("selected"); -- PROBLEM WITH OPTGROUP
							// TRIGGER CLICK ON REMOVE FILTER (IF EXIST)
							removeFilter.click();
							// TRIGGER CHANGE AND VALUE NULL FORM OPTGROUP SEARCH (IF EXIST)
							searchSelect.val("__null__").trigger("change");
						}
					}

					el.trigger('change');
					leftSel.trigger('change');
				});

				// CLICK ON UP - DOWN
				$(this).next().find('.ms2side__updown').children().click(function () {
					var selectedRight = rightSel.find("option:selected");
					var selectRight = rightSel.find("option");

					if (!$(this).hasClass("ms2side__hide")) {
						if ($(this).hasClass("SelSort")) {
							// SORT SELECTED ELEMENT
							selectRight.sort(config.useOptionIDs ? internalIdSort : internalTextSort);
							// FIRST REMOVE FROM ORIGINAL SELECT
							el.find("option:selected").remove();
							// AFTER ADD ON ORIGINAL AND RIGHT SELECT
							selectRight.each(function () {
								rightSel.append($(this).clone().prop("selected", true));
								el.append($(this).prop("selected", true));
							});
						}
						else if ($(this).hasClass("MoveUp")) {
							var prev = selectedRight.first().prev();
							var hPrev = el.find("[value='" + prev.val() + "']");

							selectedRight.each(function () {
								$(this).insertBefore(prev);
								el.find("[value='" + $(this).val() + "']").insertBefore(hPrev);	// HIDDEN SELECT
							});
						}
						else if ($(this).hasClass("MoveDown")) {
							var next = selectedRight.last().next();
							var hNext = el.find("[value='" + next.val() + "']");

							selectedRight.each(function () {
								$(this).insertAfter(next);
								el.find("[value='" + $(this).val() + "']").insertAfter(hNext);	// HIDDEN SELECT
							});
						}
						else if ($(this).hasClass("MoveTop")) {
							var first = selectRight.first();
							var hFirst = el.find("[value='" + first.val() + "']");

							selectedRight.each(function () {
								$(this).insertBefore(first);
								el.find("[value='" + $(this).val() + "']").insertBefore(hFirst);	// HIDDEN SELECT
							});
						}
						else if ($(this).hasClass("MoveBottom")) {
							var last = selectRight.last();
							var hLast = el.find("[value='" + last.val() + "']");

							selectedRight.each(function () {
								last = $(this).insertAfter(last);	// WITH last = SAME POSITION OF SELECTED OPTION AFTER MOVE
								hLast = el.find("[value='" + $(this).val() + "']").insertAfter(hLast);	// HIDDEN SELECT
							});
						}
					}

					el.trigger('change');
					leftSel.trigger('change');
				});

				// HOVER ON OPTION
				$(this).next().find('.ms2side__options, .ms2side__updown').children().hover(
					function () {
						$(this).addClass('ms2side_hover');
					},
					function () {
						$(this).removeClass('ms2side_hover');
					}
				);

				// UPDATE BUTTON ON START
				leftSel.trigger('change');
				// SHOW WHEN ALL READY
				$(this).next().show();
			});
		},
		destroy : function( ) {
			return this.each(function () {
				var	el = $(this);
				var data = el.data('multiselect2side');

				if (!data)
					return;

				el.show().next().remove();
			});
		},

		addOption : function(options) {
			var oAddOption = {
				name: false,
				value: false,
				id: false,
				selected: false,
				optionClass: false
			};

			// the this keyword is a jQuery object
			return this.each(function () {

				// the this keyword is a DOM element
				var	el = $(this);
				var data = el.data('multiselect2side');

				if (!data)
					return;

				if (options)
					$.extend(oAddOption, options);

				var	strEl = "<option " +
					(oAddOption.id ? "id='" + oAddOption.id + "'" : "") +
				    "value='" + oAddOption.value + "' " +
					(oAddOption.optionClass ? "class='" + oAddOption.optionClass + "'" : "") +
					(oAddOption.selected ? "selected" : "") +
					" >" +
					oAddOption.name + "</option>";

				el.append(strEl);

				// ELEMENTS
				var allSel = el.next().children(".ms2side__select").children("select");
				var	leftSel = (data.selectedPosition == 'right') ? allSel.eq(0) : allSel.eq(1);
				var	rightSel = (data.selectedPosition == 'right') ? allSel.eq(1) : allSel.eq(0);

				if (oAddOption.selected)
					rightSel.append(strEl).trigger('change');
				else
					leftSel.append(strEl).trigger('change');
			});
		}
	};

  $.fn.multiselect2side = function( method ) {
    if ( methods[method] ) {
      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.multiselect2side' );
    }    
  };

})(jQuery);
