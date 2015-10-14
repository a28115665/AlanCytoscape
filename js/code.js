$(function() { // on dom ready

    // photos from flickr with creative commons license

    var cy = cytoscape({
        container: document.getElementById('cy'),

        style: cytoscape.stylesheet()
            .selector('node')
            .css({
                'height': 80,
                'width': 80,
                'background-fit': 'cover',
                'background-color': '#FDA9B3',
                'border-color': '#84B8F4',
                'border-width': 5,
                'border-opacity': 0.5,
                'content': 'data(id)',
                'background-image': 'data(image)'
            })
            .selector('node:selected')
            .css({
                'border-width': 9,
                'border-color': 'red',
                'transition-duration': '0.5s'
            })
            .selector('.eating')
            .css({
                'border-color': 'red'
            })
            .selector('.eater')
            .css({
                'border-width': 9,
                'border-color': 'red'
            })
            .selector('edge')
            .css({
                'width': 4,
                'target-arrow-shape': 'triangle',
                'line-color': '#7494EE',
                'target-arrow-color': '#7494EE',
                'content': 'data(label)'
            })
            .selector('.highlighted')
            .css({
                'background-color': '#FCCE61',
                'line-color': '#FCCE61',
                'target-arrow-color': '#FCCE61',
                'transition-property': 'background-color, line-color, target-arrow-color',
                'transition-duration': '0.5s'
            }),

        elements: {
            nodes: [{
                data: {
                    id: 'IronMan',
                    image: './image/1368100115_Red_Chin_Iron_Man.png'
                }
            }, {
                data: {
                    id: 'Batman',
                    image: './image/1368100123_Batman.png'
                }
            }, {
                data: {
                    id: 'Spidey',
                    image: './image/1368100128_Spidey_Cant_Stand_Vilains!.png'
                }
            }, {
                data: {
                    id: 'Serious',
                    image: './image/1368100132_Serious.png'
                }
            }, {
                data: {
                    id: 'Proliferates',
                    image: './image/1368100134_My_plot_proliferates.png'
                }
            }, {
                data: {
                    id: 'Shield',
                    image: './image/1368100137_Cap-Shield.png'
                }
            }, {
                data: {
                    id: 'Thor',
                    image: './image/1390485428_Thor.png'
                }
            }, {
                data: {
                    id: 'Hulk',
                    image: './image/1390485432_Happy_Hulk.png'
                }
            }, {
                data: {
                    id: 'A',
                    image: './image/1402558357_A.png'
                }
            }, {
                data: {
                    id: 'MethodMan',
                    image: './image/1402558376_Method_Man.png'
                }
            }],
            edges: [{
                data: {
                    source: 'IronMan',
                    target: 'Batman',
                    label: '攻擊'
                }
            }, {
                data: {
                    source: 'IronMan',
                    target: 'Spidey',
                    label: '攻擊'
                }
            }, {
                data: {
                    source: 'IronMan',
                    target: 'Serious'
                }
            }, {
                data: {
                    source: 'Batman',
                    target: 'Proliferates'
                }
            }, {
                data: {
                    source: 'Batman',
                    target: 'Shield'
                }
            }, {
                data: {
                    source: 'Spidey',
                    target: 'IronMan',
                    label: '閃避'
                }
            }, {
                data: {
                    source: 'Spidey',
                    target: 'Thor'
                }
            }, {
                data: {
                    source: 'Spidey',
                    target: 'Hulk'
                }
            }, {
                data: {
                    source: 'Serious',
                    target: 'A'
                }
            }, {
                data: {
                    source: 'Serious',
                    target: 'MethodMan'
                }
            }]
        },

        // show layout style
        layout: {
            name: 'arbor',

            animate: true, // whether to show the layout as it's running
            maxSimulationTime: 4000, // max length in ms to run the layout
            fit: true, // on every layout reposition of nodes, fit the viewport
            padding: 30, // padding around the simulation
            boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
            ungrabifyWhileSimulating: false, // so you can't drag nodes during layout

            // callbacks on layout events
            ready: undefined, // callback on layoutready
            stop: undefined, // callback on layoutstop

            // forces used by arbor (use arbor default on undefined)
            repulsion: undefined,
            stiffness: undefined,
            friction: undefined,
            gravity: true,
            fps: undefined,
            precision: undefined,

            // static numbers or functions that dynamically return what these
            // values should be for each element
            // e.g. nodeMass: function(n){ return n.data('weight') }
            nodeMass: undefined,
            edgeLength: undefined,

            stepSize: 0.1, // smoothing of arbor bounding box

            // function that returns true if the system is stable to indicate
            // that the layout can be stopped
            stableEnergy: function(energy) {
                var e = energy;
                return (e.max <= 0.5) || (e.mean <= 0.3);
            },

            // infinite layout options
            infinite: true // overrides all other options for a forces-all-the-time mode
                // name: 'cose',
                // directed: true,
                // roots: '#a',
                // padding: 10
        }
    }); // cy init

    // keep last edges
    var _neighborhoodEdges = null;

    // tap some node
    cy.on('tap', 'node', function() {

        var nodes = this;
        var food = [];

        var delay = 0;
        var duration = 500;

        // keep neighborhood edges
        var neighborhoodEdges = nodes.neighborhood(function(){
          return this.isEdge();
        });

        // this is next time, last edges to recovery
        if(_neighborhoodEdges != null){
          for(var i = 0 ; i < _neighborhoodEdges.length ; i++){
            var lastneighborhoodEdges = _neighborhoodEdges[i];

            lastneighborhoodEdges
            .removeClass('highlighted')
            .animate({
              position: lastneighborhoodEdges.position(),
              css: {
                'width': 4,
                'border-width': 0,
                'opacity': 1
              }
            }, {
              duration: duration,
            });
          }
        }
        // put new edges in old edges, while next time to editor
        _neighborhoodEdges = neighborhoodEdges;

        // new edges change
        for( var i = neighborhoodEdges.length - 1; i >= 0; i-- ){ (function(){
          var thisneighborhoodEdges = neighborhoodEdges[i];

          thisneighborhoodEdges.delay( delay, function(){
            thisneighborhoodEdges.addClass('highlighted');
          } ).animate({
            position: thisneighborhoodEdges.position(),
            css: {
              'width': 10,
              'height': 10,
              'border-width': 0,
              'opacity': 1
            }
          }, {
            duration: duration,
            // complete: function(){
            //   thisFood.remove();
            // }
          });

          // delay += duration;
        })(); } // for new edges change

        for (;;) {
            var connectedEdges = nodes.connectedEdges(function() {
                // return !this.target().anySame( nodes );
            });

            var connectedNodes = connectedEdges.targets();

            // Array.prototype.push.apply( food, connectedNodes );

            nodes = connectedNodes;

            if (nodes.empty()) {
                break;
            }
        }

        var delay = 0;
        var duration = 500;
        for (var i = food.length - 1; i >= 0; i--) {
            (function() {
                var thisFood = food[i];
                var eater = thisFood.connectedEdges(function() {
                    return this.target().same(thisFood);
                }).source();

                thisFood.delay(delay, function() {
                    eater.addClass('eating');
                }).animate({
                    position: eater.position(),
                    css: {
                        'width': 10,
                        'height': 10,
                        'border-width': 0,
                        'opacity': 0
                    }
                }, {
                    duration: duration,
                    complete: function() {
                        thisFood.remove();
                    }
                });

                delay += duration;
            })();
        } // for

    }); // on tap

}); // on dom ready
