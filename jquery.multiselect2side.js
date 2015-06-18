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

	function clearTextFilterResults(ms2side)
	{
		ms2side.find("input.optionSearchInput").next().click();
	}

	function clearOptGroupFilterResults(ms2side)
	{
		ms2side.find('select.optGroupSearchSelect').val("__null__").change();
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
			if (config.positionOfIncluded == 'right')
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
			if (config.positionOfIncluded == 'right')
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
				((config.positionOfIncluded != 'right' && config.moveOptions) ? divUpDown : "") +
				"<div class='ms2side__select_container'>" +
					getSelectHeader(config, 'left') +
					getSearchbox(config, 'left') +
					getSelectHtml($underlyingSelect, config, leftSelectLabel, size, 'left') +
				"</div>" +
				"<div class='ms2side__options'>" +
					getSelectionControls(config) +
				"</div>" +
				"<div class='ms2side__select_container'>" +
					getSelectHeader(config, 'right') +
					getSearchbox(config, 'right') +
					getSelectHtml($underlyingSelect, config, rightSelectLabel, size, 'right') +
				"</div>" +
				((config.positionOfIncluded == 'right' && config.moveOptions) ? divUpDown : "") +
			"</div>";
		return htmlToAdd;
	}

	function getSelectHeader(config, targetPosition) {

		var searchTogglingElements = '';
		if (config.positionOfIncluded != targetPosition)
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
				(targetPosition === 'right' ? config.labelIncluded : config.labelAvailable) +
			"</div>";

		return header;
	}

	function getVerticalTwoSidedSelectHtml($underlyingSelect, config, leftSelectName, rightSelectName, size)
	{
		var divUpDown = getDivUpDown(config);

		var htmlToAdd =
			"<div class='ms2side__div'>" +
				((config.positionOfIncluded != 'right' && config.moveOptions) ? divUpDown : "") +
				"<div class='ms2side__select_container'>" +
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
				"<div class='ms2side__select_container'>" +
					getSelectHeader(config, 'right') +
					getSearchbox(config, 'right') +
					getSelectHtml($underlyingSelect, config, rightSelectName, size, 'right') +
				"</div>" +
				((config.positionOfIncluded == 'right' && config.moveOptions) ? divUpDown : "") +
			"</div>";
		return htmlToAdd;
	}

	function getSelectHtml($underlyingSelect, config, selectName, size, targetPosition)
	{
		var selectHtml = "<select " +
			"title='" + (targetPosition === 'right' ? config.labelIncluded : config.labelAvailable) + "' " +
			"class='ms2side__select'" +
			"name='" + selectName  + "' " +
			"id='" + selectName  + "' " +
			"size='" + size  + "' " +
			"multiple='multiple' >";
		$underlyingSelect.find("option").each(function(index, option) {
			if (option.selected)
			{
				if (config.positionOfIncluded === targetPosition) {
					selectHtml += '<option id="' + option.id + '" ' +
					'class="' + option.className + '" ' +
					'value="' + option.value + '" ' +
					'>' + option.text + '</option>';
				}
			}
			else
			{
				if (config.positionOfIncluded !== targetPosition) {
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

		if (config.positionOfIncluded != targetPosition)
		{
			searchHtml =
				"<div style='display:none; padding-top:1%;' class='optGroupSearchElement'>" +
					"<select class='optGroupSearchSelect'>" +
						"<option value='__null__'  selected>" + config.optGroupSearch + "</option>" +
					"</select> " +
				"</div>";
		}


		if (config.positionOfIncluded != targetPosition)
		{
			searchHtml +=
				"<div style='display:none; padding-top:1%;' class='optionSearchElement'>" +
					"<input class='optionSearchInput' type='text' placeholder='" + config.search +"'></input>" +
					"<a href='#'> </a>" +
				"</div>";
		}

		return searchHtml;
	}

	function getOptionGroups(el)
	{
		var optGroupLabels = el.children("option").map(
			function (index, domElement) {
				return $(domElement).data('optgroup');
			}
		).get();
		var uniqueOptGroupLabels = optGroupLabels.filter(
			function(label, index, srcArray)
			{
				return index == srcArray.indexOf(label);
			}
		);
		return uniqueOptGroupLabels;
	}

	function setupSearchCapabilities(config, el, availableSelect)
	{
		// SELECT optgroup
		var optGroupSelect = $();

		// SEARCH INPUT
		var optionSearchInput = el.next().find("input.optionSearchInput");
		var clearOptionSearchButton = optionSearchInput.next().hide();
		var toid = false;
		var searchV = false;

		// SELECT optgroup - ADD ALL OPTGROUP AS OPTION
		if (config.optGroupSearch != false) {
			var lastOptGroupSearch = false;

			optGroupSelect = el.next().find("select.optGroupSearchSelect").eq(0);

			var optGroups = getOptionGroups(el);
			optGroups.forEach(function (optGroup) {
				if (optGroupSelect.find("[value='" + optGroup + "']").size() == 0)
					optGroupSelect.append("<option value='" + optGroup + "'>" + optGroup + "</option>");
			});

			optGroupSelect.change(function () {
				var sEl = $(this);

				if (sEl.val() != lastOptGroupSearch) {

					// IF EXIST SET SEARCH TEXT TO VOID
					if (optionSearchInput.val() != "") {
						clearTimeout(toid);
						clearOptionSearchButton.hide();
						optionSearchInput.val("");//.trigger('keyup');
						searchV = "";
						// filterTheOptions();
					}

					setTimeout(
						function ()
						{
							var optionsInThisGroup = el.find("option:not(:selected)");
							if (sEl.val() != "__null__")
							{
								optionsInThisGroup = optionsInThisGroup.filter(
									function() { return $(this).data('optgroup') == sEl.val(); }
								);
							}

							// REMOVE ORIGINAL ELEMENTS AND ADD OPTION OF OPTGROUP SELECTED
							availableSelect.find("option").remove();
							optionsInThisGroup.each(function () {
								availableSelect.append($(this).clone(true).off());
							});
							lastOptGroupSearch = sEl.val();
							availableSelect.trigger('change');
						},
						100
					);
				}
			});
		}


		// SEARCH FUNCTION
		var filterTheOptions = function () {
			var els = availableSelect.children();
			var toSearch = el.find("option:not(:selected)");

			// RESET OptGroupSearch
			clearOptGroupFilterResults(el.next());

			if (searchV == optionSearchInput.val())
				return;

			optionSearchInput
				.addClass("wait")
				.attr("style", '');

			searchV = optionSearchInput.val();

			// A LITTLE TIMEOUT TO VIEW WAIT CLASS ON INPUT ON IE
			setTimeout(function () {
				availableSelect.children().remove();
				if (searchV == "") {
					toSearch.clone(true).off().appendTo(availableSelect).prop("selected", false);
					clearOptionSearchButton.hide();
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
							$(this).clone(true).off().appendTo(availableSelect).prop("selected", false);
					});

					if (availableSelect.children().length == 0)
						optionSearchInput.css({'border': '1px red solid'});

					clearOptionSearchButton.show();
					availableSelect.trigger('change');
				}
				availableSelect.trigger('change');
				optionSearchInput.removeClass("wait");
			}, 5);
		};

		// REMOVE FILTER ON SEARCH FUNCTION
		clearOptionSearchButton.click(function () {
			clearTimeout(toid);
			optionSearchInput.val("");
			filterTheOptions();
			return false;
		});

		// ON CHANGE TEXT INPUT
		optionSearchInput.keyup(function () {
			clearTimeout(toid);
			toid = setTimeout(filterTheOptions, config.delay);
		});

		return optGroupSelect;
	}

	function ensureBothSelectsAreSameHeight()
	{
		var thisDiv = $(this).closest('.ms2side__select_container');
		var thisDivHeight = thisDiv.prop('offsetHeight');
		var otherDiv = thisDiv.siblings('.ms2side__select_container');
		otherDiv.css('height', thisDivHeight);
		var otherDivHeaderHeight = otherDiv.find('.ms2side__header').prop('offsetHeight');
		otherDiv.find('select.ms2side__select').css('height', thisDivHeight - otherDivHeaderHeight);
	}

	function toggleOptionSearchElementVisibility(el)
	{
		var ms2side = el.next();
		var optionSearchDiv = ms2side.find('.optionSearchElement');
		optionSearchDiv.toggle();
		if (optionSearchDiv.is(':visible'))
		{
			var optGroupSearchDiv = ms2side.find('.optGroupSearchElement');
			clearOptGroupFilterResults(ms2side);
			optGroupSearchDiv.hide();
		}
		ensureBothSelectsAreSameHeight.call(this);
		el.trigger('heightchange');
	}

	function toggleOptGroupSearchElementVisibility(el)
	{
		var ms2side = el.next();
		var optGroupSearchDiv = ms2side.find('.optGroupSearchElement');
		optGroupSearchDiv.toggle();
		if (optGroupSearchDiv.is(':visible'))
		{
			clearTextFilterResults(ms2side);
			var optionSearchDiv = ms2side.find('.optionSearchElement');
			optionSearchDiv.hide();
		}
		ensureBothSelectsAreSameHeight.call(this);
		el.trigger('heightchange');
	}


	function convertGroupedOptions(el)
	{
		el.find('option').each(
			function(index, optionElement)
			{
				var optGroup = $(optionElement).closest('optgroup');
				if (optGroup.length > 0)
				{
					$(optionElement).data('optgroup', optGroup.attr('label'));
				}
				$(optionElement).detach().appendTo(el);
			}
		);
		el.children('optgroup').remove();
	}

	function addTwoSidedSelect (el, config, nameLeftSide, nameRightSide, size) {
		convertGroupedOptions(el);
		var htmlToAdd = getTwoSidedSelectHtml(el, config, nameLeftSide, nameRightSide, size);
		el.after(htmlToAdd).hide();
		el.parent().find('.toggleOptGroupSearchElements').on('click', partial(toggleOptGroupSearchElementVisibility, el));
		el.parent().find('.toggleOptionSearchElements').on('click', partial(toggleOptionSearchElementVisibility, el));
	}

	function getSelectSize(el, config) {
		var size = el.prop("size");
		// SIZE MIN
		if (size < config.minSize) {
			el.prop("size", config.minSize);
			size = config.minSize;
		}
		return size;
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

				var allSel = $(this).next().find("select.ms2side__select");
				if (useOptionIDs) {
					allSel.find('option[id="' + existingOption + '"]').remove();
					el.find('option[id="' + existingOption + '"]').remove();
				}
				else {
					allSel.find('option[value="' + existingOption + '"]').remove();
					el.find('option[value="' + existingOption + '"]').remove();
				}

				clearTextFilterResults(el.next());
				clearOptGroupFilterResults(el.next());
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

				var allSel = el.next().find("select.ms2side__select");

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

				clearTextFilterResults(el.next());
				clearOptGroupFilterResults(el.next());
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

				var allSel = el.next().find("select.ms2side__select");
				var includedSelect = (config.positionOfIncluded == 'right') ? allSel.eq(1) : allSel.eq(0);

				var jqueryObjArray = includedSelect.find("option").map(
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

				var allSel = el.next().find("select.ms2side__select");
				var availableSelect = (config.positionOfIncluded == 'right') ? allSel.eq(0) : allSel.eq(1);
				var jqueryObjArray = availableSelect.find("option").map(
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

				// unselect all
				el.find('option').prop("selected", false);

				var unselectedOptionArray = unselectedOptions.split(",");
				for (var i = unselectedOptionArray.length - 1; i >= 0; i--) {
					if (useOptionIDs) {
						$('#' + originalId + ' option[id="' + unselectedOptionArray[i] + '"]').prop("selected", true).detach().appendTo(el);
					}
					else {
						$('#' + originalId + ' option[value="' + unselectedOptionArray[i] + '"]').prop("selected", true).detach().appendTo(el);
					}
				}

				var selectedOptionArray = selectedOptions.split(",");
				for (var i = 0; i < selectedOptionArray.length; i++) {

					if (useOptionIDs) {
						$('#' + originalId + ' option[id="' + selectedOptionArray[i] + '"]').prop("selected", true).detach().appendTo(el);
					}
					else {
						$('#' + originalId + ' option[value="' + selectedOptionArray[i] + '"]').prop("selected", true).detach().appendTo(el);
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

				var allSel = el.next().find("select.ms2side__select");
				var availableSelect = (config.positionOfIncluded == 'right') ? allSel.eq(0) : allSel.eq(1);
				var includedSelect = (config.positionOfIncluded == 'right') ? allSel.eq(1) : allSel.eq(0);

				// clear out both lists
				includedSelect.children().remove();
				availableSelect.children().remove();

				// cause the options in each list to be repopulated based on the
				// source select
				el.find("option:selected").clone(true).off().appendTo(includedSelect);
				el.find("option:not(:selected)").clone(true).off().appendTo(availableSelect);
				el.next().show();

				clearTextFilterResults(el.next());
				clearOptGroupFilterResults(el.next());

			});
		},

		init : function(userConfig) {
			var config = {
				positionOfIncluded: 'right',
				moveOptions: true,
				labelTop: 'Top',
				labelBottom: 'Bottom',
				labelUp: 'Up',
				labelDown: 'Down',
				labelSort: 'Sort',
				labelAvailable: 'Available',
				labelIncluded: 'Included',
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

				var nameRightSide = "ms2side__rightSide" + originalName;
				var nameLeftSide = "ms2side__leftSide" + originalName;

				var size = getSelectSize(el, config);

				// CREATE NEW ELEMENT (AND HIDE IT) AFTER THE HIDDEN ORIGINAL SELECT
				addTwoSidedSelect(el, config, nameLeftSide, nameRightSide, size);

				// ELEMENTS
				var allSel = el.next().find("select.ms2side__select");
				var availableSelect = (config.positionOfIncluded == 'right') ? allSel.eq(0) : allSel.eq(1);
				var includedSelect = (config.positionOfIncluded == 'right') ? allSel.eq(1) : allSel.eq(0);

				// HEIGHT DIV
				var heightDiv = $(".ms2side__select_container").eq(0).height();

				var searchSelect = setupSearchCapabilities(config, el, availableSelect);
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
					availableSelect.find("option").eq(0).prop("selected", true);
					includedSelect.children().prop("selected", false);
				}

				// ON CHANGE SORT SELECTED OPTIONS
				var nLastAutosort = 0;
				if (config.autoSort)
					allSel.change(function () {
						var selectedOption = includedSelect.find("option");

						if (selectedOption.length != nLastAutosort) {
							// SORT SELECTED ELEMENT
							selectedOption.sort(config.useOptionIDs ? internalIdSort : internalTextSort);
							// FIRST REMOVE FROM ORIGINAL SELECT
							el.find("option:selected").remove();
							// AFTER ADD ON ORIGINAL AND RIGHT SELECT
							selectedOption.each(function () {
								includedSelect.append($(this).clone(true).off());
								$(this).appendTo(el).prop("selected", true);
							});
							nLastAutosort = selectedOption.length;
						}
					});

				// ON CHANGE SORT AVAILABLE OPTIONS (NOT NECESSARY IN ORIGINAL SELECT)
				var nLastAutosortAvailable = 0;
				if (config.autoSortAvailable)
					allSel.change(function () {
						var availableOptions = availableSelect.find("option");

						if (availableOptions.length != nLastAutosortAvailable) {
							// SORT SELECTED ELEMENT
							availableOptions.sort(config.useOptionIDs ? internalIdSort : internalTextSort);
							// REMOVE ORIGINAL ELEMENTS AND ADD SORTED
							availableSelect.find("option").remove();
							availableOptions.each(function () {
								availableSelect.append($(this).clone(true).off());
							});
							nLastAutosortAvailable = availableOptions.length;
						}
					});

				// ON CHANGE REFRESH ALL BUTTON STATUS
				allSel.change(function () {
					var div = $(this).closest('.ms2side__div');
					var availableOptions = availableSelect.find("option");
					var selectedAvailableOptions = availableSelect.find("option:selected");
					var includedOptions = includedSelect.find("option");
					var selectedIncludedOptions = includedSelect.find("option:selected");

					if (selectedAvailableOptions.size() == 0)
						div.find(".AddOne").addClass('ms2side__hide');
					else
						div.find(".AddOne").removeClass('ms2side__hide');

					// FIRST HIDE ALL
					div.find(".RemoveOne, .MoveUp, .MoveDown, .MoveTop, .MoveBottom, .SelSort").addClass('ms2side__hide');

					if (includedOptions.length > 1)
						div.find(".SelSort").removeClass('ms2side__hide');

					if (selectedIncludedOptions.length > 0)
					{
						div.find(".RemoveOne").removeClass('ms2side__hide');

						// ALL SELECTED - NO MOVE
						if (selectedIncludedOptions.length < includedOptions.length)
						{
							// FIRST OPTION, NO UP AND TOP BUTTON
							if (selectedIncludedOptions.first().val() != includedOptions.first().val())
								div.find(".MoveUp, .MoveTop").removeClass('ms2side__hide');

							// LAST OPTION, NO DOWN AND BOTTOM BUTTON
							if (selectedIncludedOptions.last().val() != includedOptions.last().val())
								div.find(".MoveDown, .MoveBottom").removeClass('ms2side__hide');
						}
					}

					if (availableOptions.length == 0)
						div.find(".AddAll").addClass('ms2side__hide');
					else
						div.find(".AddAll").removeClass('ms2side__hide');

					if (includedOptions.length == 0)
						div.find(".RemoveAll").addClass('ms2side__hide');
					else
						div.find(".RemoveAll").removeClass('ms2side__hide');
				});

				// DOUBLE CLICK ON LEFT SELECT OPTION
				availableSelect.dblclick(function () {
					$(this).find("option:selected").each(function (i, selected) {

						$(this).detach().appendTo(includedSelect);
						el.find("[value='" + $(selected).val() + "']").detach().appendTo(el).prop("selected", true);

					});
					el.trigger('change');
					$(this).trigger('change');
				});

				// DOUBLE CLICK ON RIGHT SELECT OPTION
				includedSelect.dblclick(function () {
					$(this).find("option:selected").each(function (i, selected) {
						$(this).detach().appendTo(availableSelect);
						el.find("[value='" + $(selected).val() + "']").prop("selected", false).detach().appendTo(el);
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
							availableSelect.find("option:selected").each(function (i, selected) {
								$(this).detach().appendTo(includedSelect);
								el.find("[value='" + $(selected).val() + "']").detach().appendTo(el).prop("selected", true);
							});
						}
						else if ($(this).hasClass("AddAll")) {	// ALL SELECTED
							// TEST IF HAVE A FILTER OR A SELECT OPTGROUP
							if (removeFilter.is(":visible") || (searchSelect.length > 0 && searchSelect.val() != "__null__"))
								availableSelect.children().each(function (i, selected) {
									$(this).remove().appendTo(includedSelect);
									el.find("[value='" + $(selected).val() + "']").detach().appendTo(el).prop("selected", true);
								});
							else {
								availableSelect.children().detach().appendTo(includedSelect);
								el.find('option').prop("selected", true);
							}
						}
						else if ($(this).hasClass("RemoveOne")) {
							includedSelect.find("option:selected").each(function (i, selected) {
								$(this).detach().appendTo(availableSelect);
								el.find("[value='" + $(selected).val() + "']").detach().appendTo(el).prop("selected", false);
							});
							// TRIGGER CLICK ON REMOVE FILTER (IF EXIST)
							removeFilter.click();

							// TRIGGER CHANGE AND VALUE NULL FORM OPTGROUP SEARCH (IF EXIST)
							searchSelect.val("__null__").trigger("change");
						}
						else if ($(this).hasClass("RemoveAll")) {	// ALL REMOVED
							includedSelect.children().appendTo(availableSelect);
							includedSelect.children().remove();
							el.find('option').prop("selected", false);

							// TRIGGER CLICK ON REMOVE FILTER (IF EXIST)
							removeFilter.click();

							// TRIGGER CHANGE AND VALUE NULL FORM OPTGROUP SEARCH (IF EXIST)
							searchSelect.val("__null__").trigger("change");
						}
					}

					el.trigger('change');
					availableSelect.trigger('change');
				});

				// CLICK ON UP - DOWN
				$(this).next().find('.ms2side__updown').children().click(function () {

					var selectedIncludedOptions = includedSelect.find("option:selected");
					var includedOptions = includedSelect.find("option");

					if (!$(this).hasClass("ms2side__hide")) {
						if ($(this).hasClass("SelSort")) {
							// SORT SELECTED ELEMENT
							includedOptions.sort(config.useOptionIDs ? internalIdSort : internalTextSort);
							// FIRST REMOVE FROM ORIGINAL SELECT
							el.find("option:selected").remove();
							// AFTER ADD ON ORIGINAL AND RIGHT SELECT
							includedOptions.each(function () {
								includedSelect.append($(this).clone(true).off().prop("selected", true));
								el.append($(this).prop("selected", true));
							});
						}
						else if ($(this).hasClass("MoveUp")) {
							var prev = selectedIncludedOptions.first().prev();
							var hPrev = el.find("[value='" + prev.val() + "']");

							selectedIncludedOptions.each(function () {
								$(this).insertBefore(prev);
								el.find("[value='" + $(this).val() + "']").insertBefore(hPrev);	// HIDDEN SELECT
							});
						}
						else if ($(this).hasClass("MoveDown")) {
							var next = selectedIncludedOptions.last().next();
							var hNext = el.find("[value='" + next.val() + "']");

							selectedIncludedOptions.each(function () {
								$(this).insertAfter(next);
								el.find("[value='" + $(this).val() + "']").insertAfter(hNext);	// HIDDEN SELECT
							});
						}
						else if ($(this).hasClass("MoveTop")) {
							var first = includedOptions.first();
							var hFirst = el.find("[value='" + first.val() + "']");

							selectedIncludedOptions.each(function () {
								$(this).insertBefore(first);
								el.find("[value='" + $(this).val() + "']").insertBefore(hFirst);	// HIDDEN SELECT
							});
						}
						else if ($(this).hasClass("MoveBottom")) {
							var last = includedOptions.last();
							var hLast = el.find("[value='" + last.val() + "']");

							selectedIncludedOptions.each(function () {
								last = $(this).insertAfter(last);	// WITH last = SAME POSITION OF SELECTED OPTION AFTER MOVE
								hLast = el.find("[value='" + $(this).val() + "']").insertAfter(hLast);	// HIDDEN SELECT
							});
						}
					}

					el.trigger('change');
					availableSelect.trigger('change');
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
				availableSelect.trigger('change');
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
				optionClass: false,
				optGroup: false
			};

			// the this keyword is a jQuery object
			return this.each(function () {

				// the this keyword is a DOM element
				var	el = $(this);
				var data = el.data('multiselect2side');

				if (!data)
					return;

				var config = el.data('config');

				if (options)
					$.extend(oAddOption, options);

				var	newOption = $("<option " +
					(oAddOption.id ? "id='" + oAddOption.id + "'" : "") +
				    "value='" + oAddOption.value + "' " +
					(oAddOption.optionClass ? "class='" + oAddOption.optionClass + "'" : "") +
					(oAddOption.selected ? "selected" : "") +
					" >" +
					oAddOption.name +
					"</option>");

				el.append(newOption);

				if (options.optGroup)
				{
					newOption.data('optgroup', options.optGroup);
				}

				// ELEMENTS
				var allSel = el.next().find("select.ms2side__select");
				var availableSelect = (config.positionOfIncluded == 'right') ? allSel.eq(0) : allSel.eq(1);
				var includedSelect = (config.positionOfIncluded == 'right') ? allSel.eq(1) : allSel.eq(0);

				clearTextFilterResults(el.next());
				clearOptGroupFilterResults(el.next());

				if (oAddOption.selected)
					includedSelect.append(newOption.clone(true).off()).trigger('change');
				else
					availableSelect.append(newOption.clone(true).off()).trigger('change');
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
