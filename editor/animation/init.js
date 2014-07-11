//Dont change it
requirejs(['ext_editor_1', 'jquery_190', 'raphael_210'],
    function (ext, $, TableComponent) {

        var cur_slide = {};

        ext.set_start_game(function (this_e) {
        });

        ext.set_process_in(function (this_e, data) {
            cur_slide["in"] = data[0];
        });

        ext.set_process_out(function (this_e, data) {
            cur_slide["out"] = data[0];
        });

        ext.set_process_ext(function (this_e, data) {
            cur_slide.ext = data;
            this_e.addAnimationSlide(cur_slide);
            cur_slide = {};
        });

        ext.set_process_err(function (this_e, data) {
            cur_slide['error'] = data[0];
            this_e.addAnimationSlide(cur_slide);
            cur_slide = {};
        });

        ext.set_animate_success_slide(function (this_e, options) {
            var $h = $(this_e.setHtmlSlide('<div class="animation-success"><div></div></div>'));
            this_e.setAnimationHeight(115);
        });

        ext.set_animate_slide(function (this_e, data, options) {
            var $content = $(this_e.setHtmlSlide(ext.get_template('animation'))).find('.animation-content');
            if (!data) {
                console.log("data is undefined");
                return false;
            }

            //YOUR FUNCTION NAME
            var fname = 'magic_domino';

            var checkioInput = data.in;
            var checkioInputStr = fname + '(' + JSON.stringify(checkioInput[0]) + ", " + JSON.stringify(checkioInput[1]) + ')';

            var failError = function (dError) {
                $content.find('.call').html('Fail: ' + checkioInputStr);
                $content.find('.output').html(dError.replace(/\n/g, ","));

                $content.find('.output').addClass('error');
                $content.find('.call').addClass('error');
                $content.find('.answer').remove();
                $content.find('.explanation').remove();
                this_e.setAnimationHeight($content.height() + 60);
            };

            if (data.error) {
                failError(data.error);
                return false;
            }

            if (data.ext && data.ext.inspector_fail) {
                failError(data.ext.inspector_result_addon);
                return false;
            }
            console.log(data.ext);
            var rightResult = data.ext["answer"];
            var userResult = data.out;
            var result = data.ext["result"];
            var result_addon = data.ext["result_addon"];


            //if you need additional info from tests (if exists)
            var explanation = data.ext["explanation"];

            $content.find('.output').html('&nbsp;Your result:&nbsp;' + JSON.stringify(userResult));

            if (!result) {
                $content.find('.call').html('Fail: ' + checkioInputStr);
                $content.find('.answer').html(result_addon.message);
                $content.find('.answer').addClass('error');
                $content.find('.output').addClass('error');
                $content.find('.call').addClass('error');
            }
            else {
                $content.find('.call').html('Pass: ' + checkioInputStr);
                $content.find('.answer').remove();
            }

            if (result_addon.error_code > 3) {
                var canvas = new DominoSquare();
                canvas.draw($content.find(".explanation")[0], userResult);
            }


            this_e.setAnimationHeight($content.height() + 60);

        });

        //This is for Tryit (but not necessary)
//        var $tryit;
//        ext.set_console_process_ret(function (this_e, ret) {
//            $tryit.find(".checkio-result").html("Result<br>" + ret);
//        });
//
//        ext.set_generate_animation_panel(function (this_e) {
//            $tryit = $(this_e.setHtmlTryIt(ext.get_template('tryit'))).find('.tryit-content');
//            $tryit.find('.bn-check').click(function (e) {
//                e.preventDefault();
//                this_e.sendToConsoleCheckiO("something");
//            });
//        });

        function DominoSquare() {
            var colorOrange4 = "#F0801A";
            var colorOrange3 = "#FA8F00";
            var colorOrange2 = "#FAA600";
            var colorOrange1 = "#FABA00";

            var colorBlue4 = "#294270";
            var colorBlue3 = "#006CA9";
            var colorBlue2 = "#65A1CF";
            var colorBlue1 = "#8FC7ED";

            var colorGrey4 = "#737370";
            var colorGrey3 = "#9D9E9E";
            var colorGrey2 = "#C5C6C6";
            var colorGrey1 = "#EBEDED";

            var colorWhite = "#FFFFFF";

            var padding = 10;


            var w = 50;
            var r = w / 10;

            var attrDot = {"stroke-width": 0, "fill": colorBlue4};
            var attrTile = {"stroke": colorBlue4, "stroke-width": 2, "fill": colorBlue1};
            var middleLine = {"stroke": colorBlue2, "stroke-width": 2};
            var attrArrow = {"stroke": colorBlue1, "stroke-width": 4, "arrow-end": "classic-wide-long"};
            var attrNumb = {"stroke": colorBlue4, "fill": colorBlue4, "font-family": "Roboto", "font-size": w * 0.6, "font-weight": "bold"};


            var paper;

            this.draw = function (dom, matrix) {
                var size = matrix.length * w + w + padding * 2;
                paper = Raphael(dom, size, size + w);

                //Tiles
                for (var i = 0; i < matrix.length; i += 2) {
                    for (var j = 0; j < matrix.length; j++) {
                        paper.rect(padding + w + w * j, padding + w + w * i, w, w * 2, r * 2).attr(attrTile);
                        paper.path(Raphael.format("M{0},{1}H{2}",
                            padding + w + w * j + r,
                            padding + w * (2 + i),
                            padding + w * (2 + j) - r)).attr(middleLine);
                    }
                }
                //Dots
                for (i = 0; i < matrix.length; i++) {
                    for (j = 0; j < matrix.length; j++) {
                        var n = matrix[i][j];
                        //corners
                        var x = padding + w + w * j;
                        var y = padding + w + w * i;
                        if (n % 2 === 1) {
                            paper.circle(x + r * 5, y + r * 5, r).attr(attrDot);
                        }
                        if (n > 1) {
                            paper.circle(x + r * 2, y + r * 2, r).attr(attrDot);
                            paper.circle(x + r * 8, y + r * 8, r).attr(attrDot);
                        }
                        if (n > 3) {
                            paper.circle(x + r * 2, y + r * 8, r).attr(attrDot);
                            paper.circle(x + r * 8, y + r * 2, r).attr(attrDot);
                        }
                        if (n === 6) {
                            paper.circle(x + r * 2, y + r * 5, r).attr(attrDot);
                            paper.circle(x + r * 8, y + r * 5, r).attr(attrDot);
                        }
                    }
                }
                // Sums
                for (var row = 0; row < matrix.length; row++) {
                    paper.path(Raphael.format(
                        "M{0},{1}H{2}",
                        padding + r,
                        padding + w * row + w * 1.5,
                        padding + w - r
                    )).attr(attrArrow);
                    var s = 0;
                    for (i = 0; i < matrix.length; i++) {
                        s += matrix[row][i];
                    }
                    paper.text(padding + w / 2, padding + w * row + w * 1.5, s).attr(attrNumb);
                }
                for (var col = 0; col < matrix.length; col++) {
                    paper.path(Raphael.format(
                        "M{0},{1}V{2}",
                        padding + w * col + w * 1.5,
                        padding + r,
                        padding + w - r
                    )).attr(attrArrow);
                    s = 0;
                    for (i = 0; i < matrix.length; i++) {
                        s += matrix[i][col];
                    }
                    paper.text(padding + w * col + w * 1.5, padding + w / 2, s).attr(attrNumb);
                }
                paper.path(Raphael.format(
                    "M{0},{0}L{1},{1}",
                    padding + r,
                    padding + w - r)).attr(attrArrow);
                s = 0;
                for (i = 0; i < matrix.length; i++) {
                    s += matrix[i][i];
                }
                paper.text(padding + w / 2, padding + w / 2, s).attr(attrNumb);

                paper.path(Raphael.format(
                    "M{0},{1}L{2},{3}",
                    padding + r,
                    padding + w * matrix.length + 2 * w - r,
                    padding + w - r,
                    padding + w * matrix.length + w + r)).attr(attrArrow);
                s = 0;
                for (i = 0; i < matrix.length; i++) {
                    s += matrix[i][matrix.length - i - 1];
                }
                paper.text(padding + w / 2, padding + w * matrix.length + w * 1.5, s).attr(attrNumb);

            }
        }


    }
);
