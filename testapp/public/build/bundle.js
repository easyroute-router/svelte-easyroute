
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
var app = (function (exports) {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty) {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return lets;
        }
        return $$scope.dirty;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function flush() {
        const seen_callbacks = new Set();
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    callback();
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            $$.fragment && $$.fragment.p($$.ctx, $$.dirty);
            $$.dirty = [-1];
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined' ? window : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, value = ret) => {
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, detail));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
    }

    /* Users/alexeysolovjov/Desktop/work/svelte-easyroute/RouterLink.svelte generated by Svelte v3.16.4 */

    const file = "Users/alexeysolovjov/Desktop/work/svelte-easyroute/RouterLink.svelte";

    function create_fragment(ctx) {
    	let a;
    	let current;
    	let dispose;
    	const default_slot_template = /*$$slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			attr_dev(a, "href", /*link*/ ctx[0]);
    			add_location(a, file, 12, 0, 177);
    			dispose = listen_dev(a, "click", /*navigate*/ ctx[1], false, false, false);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot && default_slot.p && dirty[0] & /*$$scope*/ 8) {
    				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[3], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null));
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { to } = $$props;
    	const link = "#" + to;

    	function navigate(evt) {
    		evt.preventDefault();
    		evt.stopPropagation();
    		window.location.hash = link;
    	}

    	const writable_props = ["to"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<RouterLink> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;

    	$$self.$set = $$props => {
    		if ("to" in $$props) $$invalidate(2, to = $$props.to);
    		if ("$$scope" in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => {
    		return { to };
    	};

    	$$self.$inject_state = $$props => {
    		if ("to" in $$props) $$invalidate(2, to = $$props.to);
    	};

    	return [link, navigate, to, $$scope, $$slots];
    }

    class RouterLink extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { to: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RouterLink",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (/*to*/ ctx[2] === undefined && !("to" in props)) {
    			console.warn("<RouterLink> was created without expected prop 'to'");
    		}
    	}

    	get to() {
    		throw new Error("<RouterLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set to(value) {
    		throw new Error("<RouterLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* Users/alexeysolovjov/Desktop/work/svelte-easyroute/RouterOutlet.svelte generated by Svelte v3.16.4 */

    const file$1 = "Users/alexeysolovjov/Desktop/work/svelte-easyroute/RouterOutlet.svelte";

    function create_fragment$1(ctx) {
    	let div;
    	let current;
    	var switch_value = /*routeComponent*/ ctx[1];

    	function switch_props(ctx) {
    		return {
    			props: {
    				router: /*router*/ ctx[0],
    				currentRoute: /*routeInfo*/ ctx[2],
    				nested: /*router*/ ctx[0].currentRoute.routeObject.nested || false
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		var switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			attr_dev(div, "class", "svelte-easyroute-outlet");
    			add_location(div, file$1, 18, 0, 392);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (switch_instance) {
    				mount_component(switch_instance, div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty[0] & /*router*/ 1) switch_instance_changes.router = /*router*/ ctx[0];
    			if (dirty[0] & /*routeInfo*/ 4) switch_instance_changes.currentRoute = /*routeInfo*/ ctx[2];
    			if (dirty[0] & /*router*/ 1) switch_instance_changes.nested = /*router*/ ctx[0].currentRoute.routeObject.nested || false;

    			if (switch_value !== (switch_value = /*routeComponent*/ ctx[1])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div, null);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (switch_instance) destroy_component(switch_instance);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { router } = $$props;
    	let _routeComponent = false;
    	let _routeInfo = {};

    	router.afterUpdate = () => {
    		$$invalidate(3, _routeComponent = false);

    		setTimeout(
    			() => {
    				$$invalidate(3, _routeComponent = router.currentRoute.routeObject.component);
    				$$invalidate(4, _routeInfo = router.currentRoute.routeInfo);
    			},
    			2
    		);
    	};

    	let tag = "div";
    	const writable_props = ["router"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<RouterOutlet> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("router" in $$props) $$invalidate(0, router = $$props.router);
    	};

    	$$self.$capture_state = () => {
    		return {
    			router,
    			_routeComponent,
    			_routeInfo,
    			tag,
    			routeComponent,
    			routeInfo
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("router" in $$props) $$invalidate(0, router = $$props.router);
    		if ("_routeComponent" in $$props) $$invalidate(3, _routeComponent = $$props._routeComponent);
    		if ("_routeInfo" in $$props) $$invalidate(4, _routeInfo = $$props._routeInfo);
    		if ("tag" in $$props) tag = $$props.tag;
    		if ("routeComponent" in $$props) $$invalidate(1, routeComponent = $$props.routeComponent);
    		if ("routeInfo" in $$props) $$invalidate(2, routeInfo = $$props.routeInfo);
    	};

    	let routeComponent;
    	let routeInfo;

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*_routeComponent*/ 8) {
    			 $$invalidate(1, routeComponent = _routeComponent);
    		}

    		if ($$self.$$.dirty[0] & /*_routeInfo*/ 16) {
    			 $$invalidate(2, routeInfo = _routeInfo);
    		}
    	};

    	return [router, routeComponent, routeInfo];
    }

    class RouterOutlet extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { router: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RouterOutlet",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (/*router*/ ctx[0] === undefined && !("router" in props)) {
    			console.warn("<RouterOutlet> was created without expected prop 'router'");
    		}
    	}

    	get router() {
    		throw new Error("<RouterOutlet>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set router(value) {
    		throw new Error("<RouterOutlet>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.16.4 */
    const file$2 = "src/App.svelte";

    // (23:1) <RouterLink to="/">
    function create_default_slot_5(ctx) {
    	let button;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Index";
    			attr_dev(button, "type", "button");
    			add_location(button, file$2, 22, 20, 687);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(23:1) <RouterLink to=\\\"/\\\">",
    		ctx
    	});

    	return block;
    }

    // (24:1) <RouterLink to="/test">
    function create_default_slot_4(ctx) {
    	let button;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Test page";
    			attr_dev(button, "type", "button");
    			add_location(button, file$2, 23, 24, 761);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(24:1) <RouterLink to=\\\"/test\\\">",
    		ctx
    	});

    	return block;
    }

    // (25:1) <RouterLink to="/test/nested">
    function create_default_slot_3(ctx) {
    	let button;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Nested page";
    			attr_dev(button, "type", "button");
    			add_location(button, file$2, 24, 31, 846);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(25:1) <RouterLink to=\\\"/test/nested\\\">",
    		ctx
    	});

    	return block;
    }

    // (26:1) <RouterLink to="/?name=Lyoha&status=plotinka">
    function create_default_slot_2(ctx) {
    	let button;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Index page with query";
    			attr_dev(button, "type", "button");
    			add_location(button, file$2, 25, 47, 949);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(26:1) <RouterLink to=\\\"/?name=Lyoha&status=plotinka\\\">",
    		ctx
    	});

    	return block;
    }

    // (27:1) <RouterLink to="/test?name=Alex&age=22">
    function create_default_slot_1(ctx) {
    	let button;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Test page with query";
    			attr_dev(button, "type", "button");
    			add_location(button, file$2, 26, 41, 1056);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(27:1) <RouterLink to=\\\"/test?name=Alex&age=22\\\">",
    		ctx
    	});

    	return block;
    }

    // (28:1) <RouterLink to="/playground/easy/params/route">
    function create_default_slot(ctx) {
    	let button;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Router params playground";
    			attr_dev(button, "type", "button");
    			add_location(button, file$2, 27, 48, 1169);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(28:1) <RouterLink to=\\\"/playground/easy/params/route\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div0;
    	let h1;
    	let t1;
    	let p;
    	let t3;
    	let pre;
    	let br0;
    	let t4;
    	let br1;
    	let t5;
    	let br2;
    	let t6;
    	let t7;
    	let t8;
    	let t9;
    	let t10;
    	let t11;
    	let t12;
    	let hr;
    	let t13;
    	let div1;
    	let current;

    	const routerlink0 = new RouterLink({
    			props: {
    				to: "/",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const routerlink1 = new RouterLink({
    			props: {
    				to: "/test",
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const routerlink2 = new RouterLink({
    			props: {
    				to: "/test/nested",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const routerlink3 = new RouterLink({
    			props: {
    				to: "/?name=Lyoha&status=plotinka",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const routerlink4 = new RouterLink({
    			props: {
    				to: "/test?name=Alex&age=22",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const routerlink5 = new RouterLink({
    			props: {
    				to: "/playground/easy/params/route",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const routeroutlet = new RouterOutlet({
    			props: { router: /*router*/ ctx[0], nested: false },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "svelte easyroute demo";
    			t1 = space();
    			p = element("p");
    			p.textContent = "Check out console for router hooks";
    			t3 = space();
    			pre = element("pre");
    			br0 = element("br");
    			t4 = text("# Try me locally");
    			br1 = element("br");
    			t5 = text("npx degit lyohaplotinka/svelte-easyroute-demo yourapp\n\t");
    			br2 = element("br");
    			t6 = space();
    			create_component(routerlink0.$$.fragment);
    			t7 = space();
    			create_component(routerlink1.$$.fragment);
    			t8 = space();
    			create_component(routerlink2.$$.fragment);
    			t9 = space();
    			create_component(routerlink3.$$.fragment);
    			t10 = space();
    			create_component(routerlink4.$$.fragment);
    			t11 = space();
    			create_component(routerlink5.$$.fragment);
    			t12 = space();
    			hr = element("hr");
    			t13 = space();
    			div1 = element("div");
    			create_component(routeroutlet.$$.fragment);
    			attr_dev(h1, "class", "svelte-1kgcpkd");
    			add_location(h1, file$2, 18, 1, 405);
    			add_location(p, file$2, 19, 1, 437);
    			add_location(br0, file$2, 20, 98, 577);
    			add_location(br1, file$2, 20, 118, 597);
    			set_style(pre, "max-width", "500px");
    			set_style(pre, "margin", "0 auto");
    			set_style(pre, "text-align", "left");
    			set_style(pre, "background", "#e2e2e2");
    			set_style(pre, "color", "black");
    			add_location(pre, file$2, 20, 1, 480);
    			add_location(br2, file$2, 21, 7, 662);
    			add_location(hr, file$2, 28, 1, 1239);
    			attr_dev(div0, "class", "container-fluid mt-3 mb-3 text-center");
    			add_location(div0, file$2, 17, 0, 352);
    			attr_dev(div1, "class", "container mt-5 shadowbox");
    			add_location(div1, file$2, 30, 0, 1251);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, h1);
    			append_dev(div0, t1);
    			append_dev(div0, p);
    			append_dev(div0, t3);
    			append_dev(div0, pre);
    			append_dev(pre, br0);
    			append_dev(pre, t4);
    			append_dev(pre, br1);
    			append_dev(pre, t5);
    			append_dev(div0, br2);
    			append_dev(div0, t6);
    			mount_component(routerlink0, div0, null);
    			append_dev(div0, t7);
    			mount_component(routerlink1, div0, null);
    			append_dev(div0, t8);
    			mount_component(routerlink2, div0, null);
    			append_dev(div0, t9);
    			mount_component(routerlink3, div0, null);
    			append_dev(div0, t10);
    			mount_component(routerlink4, div0, null);
    			append_dev(div0, t11);
    			mount_component(routerlink5, div0, null);
    			append_dev(div0, t12);
    			append_dev(div0, hr);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, div1, anchor);
    			mount_component(routeroutlet, div1, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const routerlink0_changes = {};

    			if (dirty[0] & /*$$scope*/ 2) {
    				routerlink0_changes.$$scope = { dirty, ctx };
    			}

    			routerlink0.$set(routerlink0_changes);
    			const routerlink1_changes = {};

    			if (dirty[0] & /*$$scope*/ 2) {
    				routerlink1_changes.$$scope = { dirty, ctx };
    			}

    			routerlink1.$set(routerlink1_changes);
    			const routerlink2_changes = {};

    			if (dirty[0] & /*$$scope*/ 2) {
    				routerlink2_changes.$$scope = { dirty, ctx };
    			}

    			routerlink2.$set(routerlink2_changes);
    			const routerlink3_changes = {};

    			if (dirty[0] & /*$$scope*/ 2) {
    				routerlink3_changes.$$scope = { dirty, ctx };
    			}

    			routerlink3.$set(routerlink3_changes);
    			const routerlink4_changes = {};

    			if (dirty[0] & /*$$scope*/ 2) {
    				routerlink4_changes.$$scope = { dirty, ctx };
    			}

    			routerlink4.$set(routerlink4_changes);
    			const routerlink5_changes = {};

    			if (dirty[0] & /*$$scope*/ 2) {
    				routerlink5_changes.$$scope = { dirty, ctx };
    			}

    			routerlink5.$set(routerlink5_changes);
    			const routeroutlet_changes = {};
    			if (dirty[0] & /*router*/ 1) routeroutlet_changes.router = /*router*/ ctx[0];
    			routeroutlet.$set(routeroutlet_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(routerlink0.$$.fragment, local);
    			transition_in(routerlink1.$$.fragment, local);
    			transition_in(routerlink2.$$.fragment, local);
    			transition_in(routerlink3.$$.fragment, local);
    			transition_in(routerlink4.$$.fragment, local);
    			transition_in(routerlink5.$$.fragment, local);
    			transition_in(routeroutlet.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(routerlink0.$$.fragment, local);
    			transition_out(routerlink1.$$.fragment, local);
    			transition_out(routerlink2.$$.fragment, local);
    			transition_out(routerlink3.$$.fragment, local);
    			transition_out(routerlink4.$$.fragment, local);
    			transition_out(routerlink5.$$.fragment, local);
    			transition_out(routeroutlet.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			destroy_component(routerlink0);
    			destroy_component(routerlink1);
    			destroy_component(routerlink2);
    			destroy_component(routerlink3);
    			destroy_component(routerlink4);
    			destroy_component(routerlink5);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(div1);
    			destroy_component(routeroutlet);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { router } = $$props;

    	onMount(() => {
    		
    	});

    	const writable_props = ["router"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("router" in $$props) $$invalidate(0, router = $$props.router);
    	};

    	$$self.$capture_state = () => {
    		return { router };
    	};

    	$$self.$inject_state = $$props => {
    		if ("router" in $$props) $$invalidate(0, router = $$props.router);
    	};

    	return [router];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { router: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (/*router*/ ctx[0] === undefined && !("router" in props)) {
    			console.warn("<App> was created without expected prop 'router'");
    		}
    	}

    	get router() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set router(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Index.svelte generated by Svelte v3.16.4 */

    const { Object: Object_1 } = globals;
    const file$3 = "src/Index.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (22:20) {#each Object.keys(currentRoute.query) as key}
    function create_each_block(ctx) {
    	let p;
    	let t0_value = /*key*/ ctx[2] + "";
    	let t0;
    	let t1;
    	let t2_value = /*currentRoute*/ ctx[0].query[/*key*/ ctx[2]] + "";
    	let t2;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text(t0_value);
    			t1 = text(" ... ");
    			t2 = text(t2_value);
    			add_location(p, file$3, 22, 24, 653);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    			append_dev(p, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*currentRoute*/ 1 && t0_value !== (t0_value = /*key*/ ctx[2] + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*currentRoute*/ 1 && t2_value !== (t2_value = /*currentRoute*/ ctx[0].query[/*key*/ ctx[2]] + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(22:20) {#each Object.keys(currentRoute.query) as key}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div5;
    	let h3;
    	let t1;
    	let div4;
    	let div3;
    	let div0;
    	let h50;
    	let t3;
    	let pre0;
    	let t5;
    	let div1;
    	let h51;
    	let t7;
    	let pre1;
    	let t8;
    	let div2;
    	let h52;
    	let t10;
    	let p0;
    	let a0;
    	let t12;
    	let p1;
    	let a1;
    	let each_value = Object.keys(/*currentRoute*/ ctx[0].query);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Index page";
    			t1 = space();
    			div4 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			h50 = element("h5");
    			h50.textContent = "Current path:";
    			t3 = space();
    			pre0 = element("pre");
    			pre0.textContent = `${/*parsedRoute*/ ctx[1]}`;
    			t5 = space();
    			div1 = element("div");
    			h51 = element("h5");
    			h51.textContent = "Query params:";
    			t7 = space();
    			pre1 = element("pre");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t8 = space();
    			div2 = element("div");
    			h52 = element("h5");
    			h52.textContent = "Links:";
    			t10 = space();
    			p0 = element("p");
    			a0 = element("a");
    			a0.textContent = "GitHub";
    			t12 = space();
    			p1 = element("p");
    			a1 = element("a");
    			a1.textContent = "Home page";
    			attr_dev(h3, "class", "text-center");
    			add_location(h3, file$3, 9, 4, 189);
    			add_location(h50, file$3, 13, 16, 345);
    			add_location(pre0, file$3, 14, 16, 384);
    			attr_dev(div0, "class", "col-md-4");
    			add_location(div0, file$3, 12, 12, 306);
    			add_location(h51, file$3, 19, 16, 517);
    			add_location(pre1, file$3, 20, 16, 556);
    			attr_dev(div1, "class", "col-md-4");
    			add_location(div1, file$3, 18, 12, 478);
    			add_location(h52, file$3, 27, 16, 817);
    			attr_dev(a0, "href", "https://github.com/lyohaplotinka/svelte-easyroute");
    			add_location(a0, file$3, 28, 19, 852);
    			add_location(p0, file$3, 28, 16, 849);
    			attr_dev(a1, "href", "https://lyoha.info/en/projects/svelterouter");
    			add_location(a1, file$3, 29, 19, 946);
    			add_location(p1, file$3, 29, 16, 943);
    			attr_dev(div2, "class", "col-md-4");
    			add_location(div2, file$3, 26, 12, 778);
    			attr_dev(div3, "class", "row");
    			add_location(div3, file$3, 11, 8, 276);
    			attr_dev(div4, "class", "container-fluid mt-5");
    			add_location(div4, file$3, 10, 4, 233);
    			attr_dev(div5, "class", "container-fluid index-page");
    			add_location(div5, file$3, 8, 0, 144);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, h3);
    			append_dev(div5, t1);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			append_dev(div0, h50);
    			append_dev(div0, t3);
    			append_dev(div0, pre0);
    			append_dev(div3, t5);
    			append_dev(div3, div1);
    			append_dev(div1, h51);
    			append_dev(div1, t7);
    			append_dev(div1, pre1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(pre1, null);
    			}

    			append_dev(div3, t8);
    			append_dev(div3, div2);
    			append_dev(div2, h52);
    			append_dev(div2, t10);
    			append_dev(div2, p0);
    			append_dev(p0, a0);
    			append_dev(div2, t12);
    			append_dev(div2, p1);
    			append_dev(p1, a1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*currentRoute*/ 1) {
    				each_value = Object.keys(/*currentRoute*/ ctx[0].query);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(pre1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { currentRoute } = $$props;
    	let parsedRoute = JSON.stringify(currentRoute, false, 2);
    	const writable_props = ["currentRoute"];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Index> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("currentRoute" in $$props) $$invalidate(0, currentRoute = $$props.currentRoute);
    	};

    	$$self.$capture_state = () => {
    		return { currentRoute, parsedRoute };
    	};

    	$$self.$inject_state = $$props => {
    		if ("currentRoute" in $$props) $$invalidate(0, currentRoute = $$props.currentRoute);
    		if ("parsedRoute" in $$props) $$invalidate(1, parsedRoute = $$props.parsedRoute);
    	};

    	return [currentRoute, parsedRoute];
    }

    class Index extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { currentRoute: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Index",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (/*currentRoute*/ ctx[0] === undefined && !("currentRoute" in props)) {
    			console.warn("<Index> was created without expected prop 'currentRoute'");
    		}
    	}

    	get currentRoute() {
    		throw new Error("<Index>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currentRoute(value) {
    		throw new Error("<Index>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* Users/alexeysolovjov/Desktop/work/svelte-easyroute/RouterNestedOutlet.svelte generated by Svelte v3.16.4 */

    const file$4 = "Users/alexeysolovjov/Desktop/work/svelte-easyroute/RouterNestedOutlet.svelte";

    function create_fragment$4(ctx) {
    	let div;
    	let current;
    	var switch_value = /*comp*/ ctx[1];

    	function switch_props(ctx) {
    		return {
    			props: { route: /*route*/ ctx[0].nested || false },
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		var switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			attr_dev(div, "class", "svelte-easyroute-outlet");
    			add_location(div, file$4, 8, 0, 123);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (switch_instance) {
    				mount_component(switch_instance, div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty[0] & /*route*/ 1) switch_instance_changes.route = /*route*/ ctx[0].nested || false;

    			if (switch_value !== (switch_value = /*comp*/ ctx[1])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div, null);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (switch_instance) destroy_component(switch_instance);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { route } = $$props;
    	let comp = false;

    	if (route && route.component) {
    		comp = route.component;
    	}

    	const writable_props = ["route"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<RouterNestedOutlet> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("route" in $$props) $$invalidate(0, route = $$props.route);
    	};

    	$$self.$capture_state = () => {
    		return { route, comp };
    	};

    	$$self.$inject_state = $$props => {
    		if ("route" in $$props) $$invalidate(0, route = $$props.route);
    		if ("comp" in $$props) $$invalidate(1, comp = $$props.comp);
    	};

    	return [route, comp];
    }

    class RouterNestedOutlet extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { route: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RouterNestedOutlet",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (/*route*/ ctx[0] === undefined && !("route" in props)) {
    			console.warn("<RouterNestedOutlet> was created without expected prop 'route'");
    		}
    	}

    	get route() {
    		throw new Error("<RouterNestedOutlet>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set route(value) {
    		throw new Error("<RouterNestedOutlet>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Test.svelte generated by Svelte v3.16.4 */

    const { Object: Object_1$1 } = globals;
    const file$5 = "src/Test.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (27:20) {#each Object.keys(currentRoute.query) as key}
    function create_each_block$1(ctx) {
    	let p;
    	let t0_value = /*key*/ ctx[4] + "";
    	let t0;
    	let t1;
    	let t2_value = /*currentRoute*/ ctx[0].query[/*key*/ ctx[4]] + "";
    	let t2;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text(t0_value);
    			t1 = text(" ... ");
    			t2 = text(t2_value);
    			add_location(p, file$5, 27, 24, 815);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    			append_dev(p, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*currentRoute*/ 1 && t0_value !== (t0_value = /*key*/ ctx[4] + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*currentRoute*/ 1 && t2_value !== (t2_value = /*currentRoute*/ ctx[0].query[/*key*/ ctx[4]] + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(27:20) {#each Object.keys(currentRoute.query) as key}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div5;
    	let h3;
    	let t1;
    	let t2;
    	let div4;
    	let div3;
    	let div0;
    	let h50;
    	let t4;
    	let pre0;
    	let t6;
    	let div1;
    	let h51;
    	let t8;
    	let pre1;
    	let t9;
    	let div2;
    	let h52;
    	let t11;
    	let p0;
    	let a0;
    	let t13;
    	let p1;
    	let a1;
    	let current;

    	const nestedoutlet = new RouterNestedOutlet({
    			props: { route: /*nested*/ ctx[1] },
    			$$inline: true
    		});

    	let each_value = Object.keys(/*currentRoute*/ ctx[0].query);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			h3 = element("h3");
    			h3.textContent = "TEST page";
    			t1 = space();
    			create_component(nestedoutlet.$$.fragment);
    			t2 = space();
    			div4 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			h50 = element("h5");
    			h50.textContent = "Current path:";
    			t4 = space();
    			pre0 = element("pre");
    			pre0.textContent = `${/*parsedRoute*/ ctx[2]}`;
    			t6 = space();
    			div1 = element("div");
    			h51 = element("h5");
    			h51.textContent = "Query params:";
    			t8 = space();
    			pre1 = element("pre");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t9 = space();
    			div2 = element("div");
    			h52 = element("h5");
    			h52.textContent = "Links:";
    			t11 = space();
    			p0 = element("p");
    			a0 = element("a");
    			a0.textContent = "GitHub";
    			t13 = space();
    			p1 = element("p");
    			a1 = element("a");
    			a1.textContent = "Home page";
    			attr_dev(h3, "class", "text-center");
    			add_location(h3, file$5, 13, 4, 317);
    			add_location(h50, file$5, 18, 16, 507);
    			add_location(pre0, file$5, 19, 16, 546);
    			attr_dev(div0, "class", "col-md-4");
    			add_location(div0, file$5, 17, 12, 468);
    			add_location(h51, file$5, 24, 16, 679);
    			add_location(pre1, file$5, 25, 16, 718);
    			attr_dev(div1, "class", "col-md-4");
    			add_location(div1, file$5, 23, 12, 640);
    			add_location(h52, file$5, 32, 16, 979);
    			attr_dev(a0, "href", "https://github.com/lyohaplotinka/svelte-easyroute");
    			add_location(a0, file$5, 33, 19, 1014);
    			add_location(p0, file$5, 33, 16, 1011);
    			attr_dev(a1, "href", "https://lyoha.info/en/projects/svelterouter");
    			add_location(a1, file$5, 34, 19, 1108);
    			add_location(p1, file$5, 34, 16, 1105);
    			attr_dev(div2, "class", "col-md-4");
    			add_location(div2, file$5, 31, 12, 940);
    			attr_dev(div3, "class", "row");
    			add_location(div3, file$5, 16, 8, 438);
    			attr_dev(div4, "class", "container-fluid mt-5");
    			add_location(div4, file$5, 15, 4, 395);
    			attr_dev(div5, "class", "container-fluid index-page mt-3");
    			add_location(div5, file$5, 12, 0, 267);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, h3);
    			append_dev(div5, t1);
    			mount_component(nestedoutlet, div5, null);
    			append_dev(div5, t2);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			append_dev(div0, h50);
    			append_dev(div0, t4);
    			append_dev(div0, pre0);
    			append_dev(div3, t6);
    			append_dev(div3, div1);
    			append_dev(div1, h51);
    			append_dev(div1, t8);
    			append_dev(div1, pre1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(pre1, null);
    			}

    			append_dev(div3, t9);
    			append_dev(div3, div2);
    			append_dev(div2, h52);
    			append_dev(div2, t11);
    			append_dev(div2, p0);
    			append_dev(p0, a0);
    			append_dev(div2, t13);
    			append_dev(div2, p1);
    			append_dev(p1, a1);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const nestedoutlet_changes = {};
    			if (dirty[0] & /*nested*/ 2) nestedoutlet_changes.route = /*nested*/ ctx[1];
    			nestedoutlet.$set(nestedoutlet_changes);

    			if (dirty[0] & /*currentRoute*/ 1) {
    				each_value = Object.keys(/*currentRoute*/ ctx[0].query);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(pre1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nestedoutlet.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nestedoutlet.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			destroy_component(nestedoutlet);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { currentRoute } = $$props;
    	let { router } = $$props;
    	let { nested } = $$props;
    	let parsedRoute = JSON.stringify(currentRoute, false, 2);
    	const writable_props = ["currentRoute", "router", "nested"];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Test> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("currentRoute" in $$props) $$invalidate(0, currentRoute = $$props.currentRoute);
    		if ("router" in $$props) $$invalidate(3, router = $$props.router);
    		if ("nested" in $$props) $$invalidate(1, nested = $$props.nested);
    	};

    	$$self.$capture_state = () => {
    		return {
    			currentRoute,
    			router,
    			nested,
    			parsedRoute
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("currentRoute" in $$props) $$invalidate(0, currentRoute = $$props.currentRoute);
    		if ("router" in $$props) $$invalidate(3, router = $$props.router);
    		if ("nested" in $$props) $$invalidate(1, nested = $$props.nested);
    		if ("parsedRoute" in $$props) $$invalidate(2, parsedRoute = $$props.parsedRoute);
    	};

    	return [currentRoute, nested, parsedRoute, router];
    }

    class Test extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { currentRoute: 0, router: 3, nested: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Test",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (/*currentRoute*/ ctx[0] === undefined && !("currentRoute" in props)) {
    			console.warn("<Test> was created without expected prop 'currentRoute'");
    		}

    		if (/*router*/ ctx[3] === undefined && !("router" in props)) {
    			console.warn("<Test> was created without expected prop 'router'");
    		}

    		if (/*nested*/ ctx[1] === undefined && !("nested" in props)) {
    			console.warn("<Test> was created without expected prop 'nested'");
    		}
    	}

    	get currentRoute() {
    		throw new Error("<Test>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currentRoute(value) {
    		throw new Error("<Test>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get router() {
    		throw new Error("<Test>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set router(value) {
    		throw new Error("<Test>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get nested() {
    		throw new Error("<Test>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set nested(value) {
    		throw new Error("<Test>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/ParamsPlayground.svelte generated by Svelte v3.16.4 */

    const { console: console_1 } = globals;
    const file$6 = "src/ParamsPlayground.svelte";

    function create_fragment$6(ctx) {
    	let div;
    	let h1;
    	let br0;
    	let t1;
    	let p0;
    	let t3;
    	let pre0;
    	let t5;
    	let p1;
    	let t7;
    	let pre1;
    	let t8_value = JSON.stringify(/*currentRoute*/ ctx[0].params, false, 2) + "";
    	let t8;
    	let t9;
    	let p2;
    	let t11;
    	let br1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Params Playground";
    			br0 = element("br");
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "This is a dynamic route. It's url defined like:";
    			t3 = space();
    			pre0 = element("pre");
    			pre0.textContent = "path: \"/playground/:param1/params/:param2\"";
    			t5 = space();
    			p1 = element("p");
    			p1.textContent = "And here what we have in currentRoute:";
    			t7 = space();
    			pre1 = element("pre");
    			t8 = text(t8_value);
    			t9 = space();
    			p2 = element("p");
    			p2.textContent = "Feel free to change parameters in URL and see the results.";
    			t11 = space();
    			br1 = element("br");
    			add_location(h1, file$6, 6, 4, 121);
    			add_location(br0, file$6, 6, 30, 147);
    			add_location(p0, file$6, 7, 4, 156);
    			set_style(pre0, "background", "lightgray");
    			set_style(pre0, "color", "black");
    			add_location(pre0, file$6, 8, 4, 215);
    			add_location(p1, file$6, 9, 4, 317);
    			add_location(pre1, file$6, 10, 4, 367);
    			add_location(p2, file$6, 11, 4, 428);
    			add_location(br1, file$6, 12, 4, 498);
    			attr_dev(div, "class", "container-fluid mt-3 text-center");
    			add_location(div, file$6, 5, 0, 70);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(div, br0);
    			append_dev(div, t1);
    			append_dev(div, p0);
    			append_dev(div, t3);
    			append_dev(div, pre0);
    			append_dev(div, t5);
    			append_dev(div, p1);
    			append_dev(div, t7);
    			append_dev(div, pre1);
    			append_dev(pre1, t8);
    			append_dev(div, t9);
    			append_dev(div, p2);
    			append_dev(div, t11);
    			append_dev(div, br1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*currentRoute*/ 1 && t8_value !== (t8_value = JSON.stringify(/*currentRoute*/ ctx[0].params, false, 2) + "")) set_data_dev(t8, t8_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { currentRoute } = $$props;
    	console.log(currentRoute);
    	const writable_props = ["currentRoute"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<ParamsPlayground> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("currentRoute" in $$props) $$invalidate(0, currentRoute = $$props.currentRoute);
    	};

    	$$self.$capture_state = () => {
    		return { currentRoute };
    	};

    	$$self.$inject_state = $$props => {
    		if ("currentRoute" in $$props) $$invalidate(0, currentRoute = $$props.currentRoute);
    	};

    	return [currentRoute];
    }

    class ParamsPlayground extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { currentRoute: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ParamsPlayground",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (/*currentRoute*/ ctx[0] === undefined && !("currentRoute" in props)) {
    			console_1.warn("<ParamsPlayground> was created without expected prop 'currentRoute'");
    		}
    	}

    	get currentRoute() {
    		throw new Error("<ParamsPlayground>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currentRoute(value) {
    		throw new Error("<ParamsPlayground>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Nested.svelte generated by Svelte v3.16.4 */

    const { console: console_1$1 } = globals;
    const file$7 = "src/Nested.svelte";

    // (8:0) {#if route}
    function create_if_block(ctx) {
    	let current;

    	const nestedoutlet = new RouterNestedOutlet({
    			props: { route: /*route*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(nestedoutlet.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(nestedoutlet, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const nestedoutlet_changes = {};
    			if (dirty[0] & /*route*/ 1) nestedoutlet_changes.route = /*route*/ ctx[0];
    			nestedoutlet.$set(nestedoutlet_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nestedoutlet.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nestedoutlet.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(nestedoutlet, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(8:0) {#if route}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let h1;
    	let t1;
    	let if_block_anchor;
    	let current;
    	let if_block = /*route*/ ctx[0] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Nested!";
    			t1 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			add_location(h1, file$7, 6, 0, 143);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*route*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    					transition_in(if_block, 1);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { route } = $$props;
    	console.log("neeeee", route);
    	const writable_props = ["route"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$1.warn(`<Nested> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("route" in $$props) $$invalidate(0, route = $$props.route);
    	};

    	$$self.$capture_state = () => {
    		return { route };
    	};

    	$$self.$inject_state = $$props => {
    		if ("route" in $$props) $$invalidate(0, route = $$props.route);
    	};

    	return [route];
    }

    class Nested extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { route: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Nested",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (/*route*/ ctx[0] === undefined && !("route" in props)) {
    			console_1$1.warn("<Nested> was created without expected prop 'route'");
    		}
    	}

    	get route() {
    		throw new Error("<Nested>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set route(value) {
    		throw new Error("<Nested>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/NestedDeep.svelte generated by Svelte v3.16.4 */

    const { console: console_1$2 } = globals;
    const file$8 = "src/NestedDeep.svelte";

    // (8:0) {#if route}
    function create_if_block$1(ctx) {
    	let current;

    	const nestedoutlet = new RouterNestedOutlet({
    			props: { route: /*route*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(nestedoutlet.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(nestedoutlet, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const nestedoutlet_changes = {};
    			if (dirty[0] & /*route*/ 1) nestedoutlet_changes.route = /*route*/ ctx[0];
    			nestedoutlet.$set(nestedoutlet_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nestedoutlet.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nestedoutlet.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(nestedoutlet, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(8:0) {#if route}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let h1;
    	let t1;
    	let if_block_anchor;
    	let current;
    	let if_block = /*route*/ ctx[0] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Nested Deep!";
    			t1 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			add_location(h1, file$8, 6, 0, 143);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*route*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    					transition_in(if_block, 1);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { route } = $$props;
    	console.log("deeeep", route);
    	const writable_props = ["route"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$2.warn(`<NestedDeep> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("route" in $$props) $$invalidate(0, route = $$props.route);
    	};

    	$$self.$capture_state = () => {
    		return { route };
    	};

    	$$self.$inject_state = $$props => {
    		if ("route" in $$props) $$invalidate(0, route = $$props.route);
    	};

    	return [route];
    }

    class NestedDeep extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { route: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NestedDeep",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (/*route*/ ctx[0] === undefined && !("route" in props)) {
    			console_1$2.warn("<NestedDeep> was created without expected prop 'route'");
    		}
    	}

    	get route() {
    		throw new Error("<NestedDeep>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set route(value) {
    		throw new Error("<NestedDeep>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/NestedDeeper.svelte generated by Svelte v3.16.4 */

    const file$9 = "src/NestedDeeper.svelte";

    function create_fragment$9(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Nested Deeper!!!";
    			add_location(h1, file$9, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    class NestedDeeper extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NestedDeeper",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function unwrapExports (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var RouterException_1 = createCommonjsModule(function (module, exports) {
    var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    var RouterException = /** @class */ (function (_super) {
        __extends(RouterException, _super);
        function RouterException(message) {
            return _super.call(this, "Easyroute Error :: " + message) || this;
        }
        return RouterException;
    }(Error));
    exports.RouterException = RouterException;
    });

    unwrapExports(RouterException_1);
    var RouterException_2 = RouterException_1.RouterException;

    var isarray = Array.isArray || function (arr) {
      return Object.prototype.toString.call(arr) == '[object Array]';
    };

    /**
     * Expose `pathToRegexp`.
     */
    var pathToRegexp_1 = pathToRegexp;
    var parse_1 = parse;
    var compile_1 = compile;
    var tokensToFunction_1 = tokensToFunction;
    var tokensToRegExp_1 = tokensToRegExp;

    /**
     * The main path matching regexp utility.
     *
     * @type {RegExp}
     */
    var PATH_REGEXP = new RegExp([
      // Match escaped characters that would otherwise appear in future matches.
      // This allows the user to escape special characters that won't transform.
      '(\\\\.)',
      // Match Express-style parameters and un-named parameters with a prefix
      // and optional suffixes. Matches appear as:
      //
      // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
      // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
      // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
      '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'
    ].join('|'), 'g');

    /**
     * Parse a string for the raw tokens.
     *
     * @param  {string}  str
     * @param  {Object=} options
     * @return {!Array}
     */
    function parse (str, options) {
      var tokens = [];
      var key = 0;
      var index = 0;
      var path = '';
      var defaultDelimiter = options && options.delimiter || '/';
      var res;

      while ((res = PATH_REGEXP.exec(str)) != null) {
        var m = res[0];
        var escaped = res[1];
        var offset = res.index;
        path += str.slice(index, offset);
        index = offset + m.length;

        // Ignore already escaped sequences.
        if (escaped) {
          path += escaped[1];
          continue
        }

        var next = str[index];
        var prefix = res[2];
        var name = res[3];
        var capture = res[4];
        var group = res[5];
        var modifier = res[6];
        var asterisk = res[7];

        // Push the current path onto the tokens.
        if (path) {
          tokens.push(path);
          path = '';
        }

        var partial = prefix != null && next != null && next !== prefix;
        var repeat = modifier === '+' || modifier === '*';
        var optional = modifier === '?' || modifier === '*';
        var delimiter = res[2] || defaultDelimiter;
        var pattern = capture || group;

        tokens.push({
          name: name || key++,
          prefix: prefix || '',
          delimiter: delimiter,
          optional: optional,
          repeat: repeat,
          partial: partial,
          asterisk: !!asterisk,
          pattern: pattern ? escapeGroup(pattern) : (asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?')
        });
      }

      // Match any characters still remaining.
      if (index < str.length) {
        path += str.substr(index);
      }

      // If the path exists, push it onto the end.
      if (path) {
        tokens.push(path);
      }

      return tokens
    }

    /**
     * Compile a string to a template function for the path.
     *
     * @param  {string}             str
     * @param  {Object=}            options
     * @return {!function(Object=, Object=)}
     */
    function compile (str, options) {
      return tokensToFunction(parse(str, options), options)
    }

    /**
     * Prettier encoding of URI path segments.
     *
     * @param  {string}
     * @return {string}
     */
    function encodeURIComponentPretty (str) {
      return encodeURI(str).replace(/[\/?#]/g, function (c) {
        return '%' + c.charCodeAt(0).toString(16).toUpperCase()
      })
    }

    /**
     * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
     *
     * @param  {string}
     * @return {string}
     */
    function encodeAsterisk (str) {
      return encodeURI(str).replace(/[?#]/g, function (c) {
        return '%' + c.charCodeAt(0).toString(16).toUpperCase()
      })
    }

    /**
     * Expose a method for transforming tokens into the path function.
     */
    function tokensToFunction (tokens, options) {
      // Compile all the tokens into regexps.
      var matches = new Array(tokens.length);

      // Compile all the patterns before compilation.
      for (var i = 0; i < tokens.length; i++) {
        if (typeof tokens[i] === 'object') {
          matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$', flags(options));
        }
      }

      return function (obj, opts) {
        var path = '';
        var data = obj || {};
        var options = opts || {};
        var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent;

        for (var i = 0; i < tokens.length; i++) {
          var token = tokens[i];

          if (typeof token === 'string') {
            path += token;

            continue
          }

          var value = data[token.name];
          var segment;

          if (value == null) {
            if (token.optional) {
              // Prepend partial segment prefixes.
              if (token.partial) {
                path += token.prefix;
              }

              continue
            } else {
              throw new TypeError('Expected "' + token.name + '" to be defined')
            }
          }

          if (isarray(value)) {
            if (!token.repeat) {
              throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`')
            }

            if (value.length === 0) {
              if (token.optional) {
                continue
              } else {
                throw new TypeError('Expected "' + token.name + '" to not be empty')
              }
            }

            for (var j = 0; j < value.length; j++) {
              segment = encode(value[j]);

              if (!matches[i].test(segment)) {
                throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`')
              }

              path += (j === 0 ? token.prefix : token.delimiter) + segment;
            }

            continue
          }

          segment = token.asterisk ? encodeAsterisk(value) : encode(value);

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
          }

          path += token.prefix + segment;
        }

        return path
      }
    }

    /**
     * Escape a regular expression string.
     *
     * @param  {string} str
     * @return {string}
     */
    function escapeString (str) {
      return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1')
    }

    /**
     * Escape the capturing group by escaping special characters and meaning.
     *
     * @param  {string} group
     * @return {string}
     */
    function escapeGroup (group) {
      return group.replace(/([=!:$\/()])/g, '\\$1')
    }

    /**
     * Attach the keys as a property of the regexp.
     *
     * @param  {!RegExp} re
     * @param  {Array}   keys
     * @return {!RegExp}
     */
    function attachKeys (re, keys) {
      re.keys = keys;
      return re
    }

    /**
     * Get the flags for a regexp from the options.
     *
     * @param  {Object} options
     * @return {string}
     */
    function flags (options) {
      return options && options.sensitive ? '' : 'i'
    }

    /**
     * Pull out keys from a regexp.
     *
     * @param  {!RegExp} path
     * @param  {!Array}  keys
     * @return {!RegExp}
     */
    function regexpToRegexp (path, keys) {
      // Use a negative lookahead to match only capturing groups.
      var groups = path.source.match(/\((?!\?)/g);

      if (groups) {
        for (var i = 0; i < groups.length; i++) {
          keys.push({
            name: i,
            prefix: null,
            delimiter: null,
            optional: false,
            repeat: false,
            partial: false,
            asterisk: false,
            pattern: null
          });
        }
      }

      return attachKeys(path, keys)
    }

    /**
     * Transform an array into a regexp.
     *
     * @param  {!Array}  path
     * @param  {Array}   keys
     * @param  {!Object} options
     * @return {!RegExp}
     */
    function arrayToRegexp (path, keys, options) {
      var parts = [];

      for (var i = 0; i < path.length; i++) {
        parts.push(pathToRegexp(path[i], keys, options).source);
      }

      var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));

      return attachKeys(regexp, keys)
    }

    /**
     * Create a path regexp from string input.
     *
     * @param  {string}  path
     * @param  {!Array}  keys
     * @param  {!Object} options
     * @return {!RegExp}
     */
    function stringToRegexp (path, keys, options) {
      return tokensToRegExp(parse(path, options), keys, options)
    }

    /**
     * Expose a function for taking tokens and returning a RegExp.
     *
     * @param  {!Array}          tokens
     * @param  {(Array|Object)=} keys
     * @param  {Object=}         options
     * @return {!RegExp}
     */
    function tokensToRegExp (tokens, keys, options) {
      if (!isarray(keys)) {
        options = /** @type {!Object} */ (keys || options);
        keys = [];
      }

      options = options || {};

      var strict = options.strict;
      var end = options.end !== false;
      var route = '';

      // Iterate over the tokens and create our regexp string.
      for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];

        if (typeof token === 'string') {
          route += escapeString(token);
        } else {
          var prefix = escapeString(token.prefix);
          var capture = '(?:' + token.pattern + ')';

          keys.push(token);

          if (token.repeat) {
            capture += '(?:' + prefix + capture + ')*';
          }

          if (token.optional) {
            if (!token.partial) {
              capture = '(?:' + prefix + '(' + capture + '))?';
            } else {
              capture = prefix + '(' + capture + ')?';
            }
          } else {
            capture = prefix + '(' + capture + ')';
          }

          route += capture;
        }
      }

      var delimiter = escapeString(options.delimiter || '/');
      var endsWithDelimiter = route.slice(-delimiter.length) === delimiter;

      // In non-strict mode we allow a slash at the end of match. If the path to
      // match already ends with a slash, we remove it for consistency. The slash
      // is valid at the end of a path match, not in the middle. This is important
      // in non-ending mode, where "/test/" shouldn't match "/test//route".
      if (!strict) {
        route = (endsWithDelimiter ? route.slice(0, -delimiter.length) : route) + '(?:' + delimiter + '(?=$))?';
      }

      if (end) {
        route += '$';
      } else {
        // In non-ending mode, we need the capturing groups to match as much as
        // possible by using a positive lookahead to the end or next path segment.
        route += strict && endsWithDelimiter ? '' : '(?=' + delimiter + '|$)';
      }

      return attachKeys(new RegExp('^' + route, flags(options)), keys)
    }

    /**
     * Normalize the given path string, returning a regular expression.
     *
     * An empty array can be passed in for the keys, which will hold the
     * placeholder key descriptions. For example, using `/user/:id`, `keys` will
     * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
     *
     * @param  {(string|RegExp|Array)} path
     * @param  {(Array|Object)=}       keys
     * @param  {Object=}               options
     * @return {!RegExp}
     */
    function pathToRegexp (path, keys, options) {
      if (!isarray(keys)) {
        options = /** @type {!Object} */ (keys || options);
        keys = [];
      }

      options = options || {};

      if (path instanceof RegExp) {
        return regexpToRegexp(path, /** @type {!Array} */ (keys))
      }

      if (isarray(path)) {
        return arrayToRegexp(/** @type {!Array} */ (path), /** @type {!Array} */ (keys), options)
      }

      return stringToRegexp(/** @type {string} */ (path), /** @type {!Array} */ (keys), options)
    }
    pathToRegexp_1.parse = parse_1;
    pathToRegexp_1.compile = compile_1;
    pathToRegexp_1.tokensToFunction = tokensToFunction_1;
    pathToRegexp_1.tokensToRegExp = tokensToRegExp_1;

    var strictUriEncode = str => encodeURIComponent(str).replace(/[!'()*]/g, x => `%${x.charCodeAt(0).toString(16).toUpperCase()}`);

    var token = '%[a-f0-9]{2}';
    var singleMatcher = new RegExp(token, 'gi');
    var multiMatcher = new RegExp('(' + token + ')+', 'gi');

    function decodeComponents(components, split) {
    	try {
    		// Try to decode the entire string first
    		return decodeURIComponent(components.join(''));
    	} catch (err) {
    		// Do nothing
    	}

    	if (components.length === 1) {
    		return components;
    	}

    	split = split || 1;

    	// Split the array in 2 parts
    	var left = components.slice(0, split);
    	var right = components.slice(split);

    	return Array.prototype.concat.call([], decodeComponents(left), decodeComponents(right));
    }

    function decode(input) {
    	try {
    		return decodeURIComponent(input);
    	} catch (err) {
    		var tokens = input.match(singleMatcher);

    		for (var i = 1; i < tokens.length; i++) {
    			input = decodeComponents(tokens, i).join('');

    			tokens = input.match(singleMatcher);
    		}

    		return input;
    	}
    }

    function customDecodeURIComponent(input) {
    	// Keep track of all the replacements and prefill the map with the `BOM`
    	var replaceMap = {
    		'%FE%FF': '\uFFFD\uFFFD',
    		'%FF%FE': '\uFFFD\uFFFD'
    	};

    	var match = multiMatcher.exec(input);
    	while (match) {
    		try {
    			// Decode as big chunks as possible
    			replaceMap[match[0]] = decodeURIComponent(match[0]);
    		} catch (err) {
    			var result = decode(match[0]);

    			if (result !== match[0]) {
    				replaceMap[match[0]] = result;
    			}
    		}

    		match = multiMatcher.exec(input);
    	}

    	// Add `%C2` at the end of the map to make sure it does not replace the combinator before everything else
    	replaceMap['%C2'] = '\uFFFD';

    	var entries = Object.keys(replaceMap);

    	for (var i = 0; i < entries.length; i++) {
    		// Replace all decoded components
    		var key = entries[i];
    		input = input.replace(new RegExp(key, 'g'), replaceMap[key]);
    	}

    	return input;
    }

    var decodeUriComponent = function (encodedURI) {
    	if (typeof encodedURI !== 'string') {
    		throw new TypeError('Expected `encodedURI` to be of type `string`, got `' + typeof encodedURI + '`');
    	}

    	try {
    		encodedURI = encodedURI.replace(/\+/g, ' ');

    		// Try the built in decoder first
    		return decodeURIComponent(encodedURI);
    	} catch (err) {
    		// Fallback to a more advanced decoder
    		return customDecodeURIComponent(encodedURI);
    	}
    };

    var splitOnFirst = (string, separator) => {
    	if (!(typeof string === 'string' && typeof separator === 'string')) {
    		throw new TypeError('Expected the arguments to be of type `string`');
    	}

    	if (separator === '') {
    		return [string];
    	}

    	const separatorIndex = string.indexOf(separator);

    	if (separatorIndex === -1) {
    		return [string];
    	}

    	return [
    		string.slice(0, separatorIndex),
    		string.slice(separatorIndex + separator.length)
    	];
    };

    function encoderForArrayFormat(options) {
    	switch (options.arrayFormat) {
    		case 'index':
    			return key => (result, value) => {
    				const index = result.length;
    				if (value === undefined || (options.skipNull && value === null)) {
    					return result;
    				}

    				if (value === null) {
    					return [...result, [encode(key, options), '[', index, ']'].join('')];
    				}

    				return [
    					...result,
    					[encode(key, options), '[', encode(index, options), ']=', encode(value, options)].join('')
    				];
    			};

    		case 'bracket':
    			return key => (result, value) => {
    				if (value === undefined || (options.skipNull && value === null)) {
    					return result;
    				}

    				if (value === null) {
    					return [...result, [encode(key, options), '[]'].join('')];
    				}

    				return [...result, [encode(key, options), '[]=', encode(value, options)].join('')];
    			};

    		case 'comma':
    			return key => (result, value) => {
    				if (value === null || value === undefined || value.length === 0) {
    					return result;
    				}

    				if (result.length === 0) {
    					return [[encode(key, options), '=', encode(value, options)].join('')];
    				}

    				return [[result, encode(value, options)].join(',')];
    			};

    		default:
    			return key => (result, value) => {
    				if (value === undefined || (options.skipNull && value === null)) {
    					return result;
    				}

    				if (value === null) {
    					return [...result, encode(key, options)];
    				}

    				return [...result, [encode(key, options), '=', encode(value, options)].join('')];
    			};
    	}
    }

    function parserForArrayFormat(options) {
    	let result;

    	switch (options.arrayFormat) {
    		case 'index':
    			return (key, value, accumulator) => {
    				result = /\[(\d*)\]$/.exec(key);

    				key = key.replace(/\[\d*\]$/, '');

    				if (!result) {
    					accumulator[key] = value;
    					return;
    				}

    				if (accumulator[key] === undefined) {
    					accumulator[key] = {};
    				}

    				accumulator[key][result[1]] = value;
    			};

    		case 'bracket':
    			return (key, value, accumulator) => {
    				result = /(\[\])$/.exec(key);
    				key = key.replace(/\[\]$/, '');

    				if (!result) {
    					accumulator[key] = value;
    					return;
    				}

    				if (accumulator[key] === undefined) {
    					accumulator[key] = [value];
    					return;
    				}

    				accumulator[key] = [].concat(accumulator[key], value);
    			};

    		case 'comma':
    			return (key, value, accumulator) => {
    				const isArray = typeof value === 'string' && value.split('').indexOf(',') > -1;
    				const newValue = isArray ? value.split(',') : value;
    				accumulator[key] = newValue;
    			};

    		default:
    			return (key, value, accumulator) => {
    				if (accumulator[key] === undefined) {
    					accumulator[key] = value;
    					return;
    				}

    				accumulator[key] = [].concat(accumulator[key], value);
    			};
    	}
    }

    function encode(value, options) {
    	if (options.encode) {
    		return options.strict ? strictUriEncode(value) : encodeURIComponent(value);
    	}

    	return value;
    }

    function decode$1(value, options) {
    	if (options.decode) {
    		return decodeUriComponent(value);
    	}

    	return value;
    }

    function keysSorter(input) {
    	if (Array.isArray(input)) {
    		return input.sort();
    	}

    	if (typeof input === 'object') {
    		return keysSorter(Object.keys(input))
    			.sort((a, b) => Number(a) - Number(b))
    			.map(key => input[key]);
    	}

    	return input;
    }

    function removeHash(input) {
    	const hashStart = input.indexOf('#');
    	if (hashStart !== -1) {
    		input = input.slice(0, hashStart);
    	}

    	return input;
    }

    function extract(input) {
    	input = removeHash(input);
    	const queryStart = input.indexOf('?');
    	if (queryStart === -1) {
    		return '';
    	}

    	return input.slice(queryStart + 1);
    }

    function parseValue(value, options) {
    	if (options.parseNumbers && !Number.isNaN(Number(value)) && (typeof value === 'string' && value.trim() !== '')) {
    		value = Number(value);
    	} else if (options.parseBooleans && value !== null && (value.toLowerCase() === 'true' || value.toLowerCase() === 'false')) {
    		value = value.toLowerCase() === 'true';
    	}

    	return value;
    }

    function parse$1(input, options) {
    	options = Object.assign({
    		decode: true,
    		sort: true,
    		arrayFormat: 'none',
    		parseNumbers: false,
    		parseBooleans: false
    	}, options);

    	const formatter = parserForArrayFormat(options);

    	// Create an object with no prototype
    	const ret = Object.create(null);

    	if (typeof input !== 'string') {
    		return ret;
    	}

    	input = input.trim().replace(/^[?#&]/, '');

    	if (!input) {
    		return ret;
    	}

    	for (const param of input.split('&')) {
    		let [key, value] = splitOnFirst(options.decode ? param.replace(/\+/g, ' ') : param, '=');

    		// Missing `=` should be `null`:
    		// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
    		value = value === undefined ? null : decode$1(value, options);
    		formatter(decode$1(key, options), value, ret);
    	}

    	for (const key of Object.keys(ret)) {
    		const value = ret[key];
    		if (typeof value === 'object' && value !== null) {
    			for (const k of Object.keys(value)) {
    				value[k] = parseValue(value[k], options);
    			}
    		} else {
    			ret[key] = parseValue(value, options);
    		}
    	}

    	if (options.sort === false) {
    		return ret;
    	}

    	return (options.sort === true ? Object.keys(ret).sort() : Object.keys(ret).sort(options.sort)).reduce((result, key) => {
    		const value = ret[key];
    		if (Boolean(value) && typeof value === 'object' && !Array.isArray(value)) {
    			// Sort object keys, not values
    			result[key] = keysSorter(value);
    		} else {
    			result[key] = value;
    		}

    		return result;
    	}, Object.create(null));
    }

    var extract_1 = extract;
    var parse_1$1 = parse$1;

    var stringify = (object, options) => {
    	if (!object) {
    		return '';
    	}

    	options = Object.assign({
    		encode: true,
    		strict: true,
    		arrayFormat: 'none'
    	}, options);

    	const formatter = encoderForArrayFormat(options);

    	const objectCopy = Object.assign({}, object);
    	if (options.skipNull) {
    		for (const key of Object.keys(objectCopy)) {
    			if (objectCopy[key] === undefined || objectCopy[key] === null) {
    				delete objectCopy[key];
    			}
    		}
    	}

    	const keys = Object.keys(objectCopy);

    	if (options.sort !== false) {
    		keys.sort(options.sort);
    	}

    	return keys.map(key => {
    		const value = object[key];

    		if (value === undefined) {
    			return '';
    		}

    		if (value === null) {
    			return encode(key, options);
    		}

    		if (Array.isArray(value)) {
    			return value
    				.reduce(formatter(key), [])
    				.join('&');
    		}

    		return encode(key, options) + '=' + encode(value, options);
    	}).filter(x => x.length > 0).join('&');
    };

    var parseUrl = (input, options) => {
    	return {
    		url: removeHash(input).split('?')[0] || '',
    		query: parse$1(extract(input), options)
    	};
    };

    var queryString = {
    	extract: extract_1,
    	parse: parse_1$1,
    	stringify: stringify,
    	parseUrl: parseUrl
    };

    var PathService_1 = createCommonjsModule(function (module, exports) {
    /**
     *
     * Svelte Easyroute 2
     *
     * Path service
     *
     * uses "path-to-regexp"
     * https://github.com/pillarjs/path-to-regexp
     */
    var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var path_to_regexp_1 = __importDefault(pathToRegexp_1);
    var query_string_1 = __importDefault(queryString);
    var PathService = /** @class */ (function () {
        function PathService() {
            this.pathToRegexp = path_to_regexp_1.default;
            this.queryString = query_string_1.default;
        }
        PathService.prototype.parsePaths = function (routes) {
            var allRoutes = [];
            var recursive = function (routesArray, parentPath) {
                if (parentPath === void 0) { parentPath = ""; }
                routesArray.forEach(function (el) {
                    if (parentPath.length) {
                        parentPath = parentPath.replace(/\*/g, "");
                        var elPath = el.path;
                        if (elPath[0] !== "/")
                            elPath = "/" + elPath;
                        el.path = parentPath + elPath;
                    }
                    allRoutes.push(el);
                    if (el.children && el.children.length) {
                        recursive(el.children, el.path);
                    }
                });
            };
            recursive(routes);
            return allRoutes;
        };
        PathService.prototype.getPathInformation = function (routes) {
            var _this = this;
            var allRoutes = this.parsePaths(routes);
            return allRoutes.map(function (route) {
                var keysArray = [];
                route.regexpPath = _this.pathToRegexp(route.path, keysArray);
                route.pathKeys = keysArray;
                return route;
            });
        };
        return PathService;
    }());
    exports.default = PathService;
    });

    unwrapExports(PathService_1);

    var HashBasedRouting_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var HashBasedRouting = /** @class */ (function () {
        function HashBasedRouting(routes) {
            this.routes = routes;
        }
        HashBasedRouting.prototype.parse = function (url) {
            this.routes = this.routes.map(function (route) {
                route.nested = undefined;
                return route;
            });
            var matchedRoutes = this.routes
                .reduce(function (total, current) {
                if (url.match(current.regexpPath))
                    total.push(current);
                return total;
            }, []);
            console.log(matchedRoutes);
            if (matchedRoutes.length > 1) {
                // for (let i = 0; i < matchedRoutes.length; i++) {
                //     let matched: IRoute | undefined = matchedRoutes[0];
                //     if (i === 0) matched.nested = matchedRoutes[i+1];
                //     else {
                //         for (let k = 0; k < i; k++) {
                //             if (matched.nested) matched = matched.nested;
                //         }
                //         matched = matchedRoutes[i+1];
                //     }
                // }
                // @TODO: Простроить цепочку нестедов в первый рут
                var matchedParent = matchedRoutes[0];
                for (var i = 0; i < matchedRoutes.length; i++) {
                    matchedParent.nested = matchedRoutes[i];
                    matchedParent = matchedParent.nested;
                }
            }
            console.log(matchedRoutes[0]);
            return matchedRoutes[0] || null;
        };
        return HashBasedRouting;
    }());
    exports.default = HashBasedRouting;
    });

    unwrapExports(HashBasedRouting_1);

    var UrlParser_1 = createCommonjsModule(function (module, exports) {
    var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var query_string_1 = __importDefault(queryString);
    var UrlParser = /** @class */ (function () {
        function UrlParser() {
            this.qString = query_string_1.default;
        }
        UrlParser.prototype.getQueryParams = function (queryString) {
            return this.qString.parse(queryString);
        };
        UrlParser.prototype.getPathParams = function (matchedRoute, url) {
            var pathValues = matchedRoute.regexpPath.exec(url);
            pathValues = pathValues.slice(1, pathValues.length);
            var urlParams = {};
            for (var pathPart in pathValues) {
                var value = pathValues[pathPart];
                var key = matchedRoute.pathKeys[pathPart].name;
                if (typeof key !== "number")
                    urlParams[key] = value;
            }
            return urlParams;
        };
        UrlParser.prototype.createRouteObject = function (matchedRoute, path, query, fullPath) {
            var pathParams = this.getPathParams(matchedRoute, path);
            var queryParams = this.getQueryParams(query);
            return {
                fullPath: fullPath,
                route: path.split('/'),
                query: JSON.parse(JSON.stringify(queryParams)),
                params: pathParams
            };
        };
        return UrlParser;
    }());
    exports.default = UrlParser;
    });

    unwrapExports(UrlParser_1);

    var CssTransitionService_1 = createCommonjsModule(function (module, exports) {
    var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __generator = (commonjsGlobal && commonjsGlobal.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var CssTransitionService = /** @class */ (function () {
        function CssTransitionService(transitionName) {
            this.transition = "";
            this.enteringDuration = 0;
            this.leavingDuration = 0;
            this.transition = transitionName;
            this.rule = new RegExp(".(" + this.transition + ")-(enter-active|leave-active)", "g");
            this.enterRule = new RegExp(".(" + this.transition + ")-enter-active", "g");
            this.leaveRule = new RegExp(".(" + this.transition + ")-leave-active", "g");
            this.getTransitionDurations();
        }
        CssTransitionService.prototype.getDurationFromRule = function (styleRule) {
            var getMaxFromCSSString = function (key) {
                if (key !== "transitionDuration" && key !== "transitionDelay")
                    return 0;
                var durations = styleRule.style[key];
                var durationsArrayString = durations.split(",");
                var durationsArray = durationsArrayString.map(function (duration) {
                    var number = parseFloat(duration.replace(/a-zA-Z/g, "").trim());
                    var measure = duration.replace(/[0-9](\.[0-9])?/g, "").trim();
                    if (measure === "s")
                        number = number * 1000;
                    return number;
                });
                return Math.max.apply(Math, durationsArray);
            };
            var duration = getMaxFromCSSString("transitionDuration");
            var delay = getMaxFromCSSString("transitionDelay");
            return duration + delay;
        };
        CssTransitionService.prototype.getTransitionDurations = function () {
            var _this = this;
            var enteringDuration = 0;
            var leavingDuration = 0;
            var styles = Array.from(document.styleSheets);
            var stylesArray = [];
            for (var _i = 0, styles_1 = styles; _i < styles_1.length; _i++) {
                var style = styles_1[_i];
                var rules = void 0;
                try {
                    rules = style.rules;
                }
                catch (e) {
                    rules = null;
                }
                if (!rules)
                    continue;
                var rulesArray = Object.values(rules);
                var filteredRules = rulesArray.filter(function (rule) {
                    var operateRule = rule;
                    if (!operateRule.selectorText)
                        return false;
                    return operateRule.selectorText.match(_this.rule);
                });
                stylesArray.push.apply(stylesArray, filteredRules);
            }
            for (var _a = 0, stylesArray_1 = stylesArray; _a < stylesArray_1.length; _a++) {
                var _styleRule = stylesArray_1[_a];
                var styleRule = _styleRule;
                var styleText = styleRule.cssText;
                // Case 1: One rule for both entering and leaving
                if (styleText.match(this.rule).length === 2) {
                    enteringDuration = leavingDuration = this.getDurationFromRule(styleRule);
                }
                // Case 2: single rule for enter and leaving
                // Entering
                if (styleText.match(this.enterRule)) {
                    enteringDuration = this.getDurationFromRule(styleRule);
                }
                // Leaving
                if (styleText.match(this.leaveRule)) {
                    leavingDuration = this.getDurationFromRule(styleRule);
                }
            }
            this.enteringDuration = enteringDuration;
            this.leavingDuration = leavingDuration;
        };
        CssTransitionService.delay = function (time) {
            return new Promise(function (resolve) {
                setTimeout(function () {
                    resolve();
                }, time);
            });
        };
        CssTransitionService.prototype.transitionOut = function () {
            return __awaiter(this, void 0, void 0, function () {
                var outlet;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            outlet = document.querySelector(".svelte-easyroute-outlet");
                            if (!outlet) return [3 /*break*/, 3];
                            outlet.classList.add(this.transition + "-leave-active");
                            outlet.classList.add(this.transition + "-leave");
                            return [4 /*yield*/, CssTransitionService.delay(100)];
                        case 1:
                            _a.sent();
                            outlet.classList.remove(this.transition + "-leave");
                            outlet.classList.add(this.transition + "-leave-to");
                            return [4 /*yield*/, CssTransitionService.delay(this.leavingDuration)];
                        case 2:
                            _a.sent();
                            outlet.classList.remove(this.transition + "-leave-active");
                            outlet.classList.remove(this.transition + "-leave-to");
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        CssTransitionService.prototype.transitionIn = function () {
            return __awaiter(this, void 0, void 0, function () {
                var outlet;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            outlet = document.querySelector(".svelte-easyroute-outlet");
                            if (!outlet) return [3 /*break*/, 3];
                            outlet.classList.add(this.transition + "-enter-active");
                            outlet.classList.add(this.transition + "-enter");
                            return [4 /*yield*/, CssTransitionService.delay(100)];
                        case 1:
                            _a.sent();
                            outlet.classList.remove(this.transition + "-enter");
                            outlet.classList.add(this.transition + "-enter-to");
                            return [4 /*yield*/, CssTransitionService.delay(this.enteringDuration)];
                        case 2:
                            _a.sent();
                            outlet.classList.remove(this.transition + "-enter-active");
                            outlet.classList.remove(this.transition + "-enter-to");
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        return CssTransitionService;
    }());
    exports.default = CssTransitionService;
    });

    unwrapExports(CssTransitionService_1);

    var dist = createCommonjsModule(function (module, exports) {
    var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __generator = (commonjsGlobal && commonjsGlobal.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });

    var PathService_1$1 = __importDefault(PathService_1);
    var HashBasedRouting_1$1 = __importDefault(HashBasedRouting_1);
    var UrlParser_1$1 = __importDefault(UrlParser_1);
    var CssTransitionService_1$1 = __importDefault(CssTransitionService_1);
    var ROUTER_MODES = [
        "hash",
        "history",
        "silent"
    ];
    var Router = /** @class */ (function () {
        function Router(params) {
            this.pathService = new PathService_1$1.default();
            this.urlParser = new UrlParser_1$1.default();
            this.mode = "hash";
            this.baseUrl = "/";
            this.fullUrl = "/";
            Router.validateParameters(params);
            this.mode = params.mode || "hash";
            this.baseUrl = Router.formatBaseUrl(params.base);
            this.routes = this.pathService.getPathInformation(params.routes);
            this.beforeEach = params.beforeEach;
            if (params.transition) {
                this.transitionService = new CssTransitionService_1$1.default(params.transition);
            }
            else {
                this.transitionService = null;
            }
            this.setParser();
        }
        Router.validateParameters = function (params) {
            if (!params || typeof params !== "object") {
                throw new RouterException_1.RouterException("Wrong parameters object format!");
            }
            if (!ROUTER_MODES.includes(params.mode)) {
                console.warn("Easyroute: router \"mode\" is not selected. You should choose one of this: " + ROUTER_MODES.join(", ") + ". Auto-selected: \"hash\".");
                params.mode = "hash";
            }
        };
        Router.formatBaseUrl = function (baseUrl) {
            if (!baseUrl)
                return "/";
            if (baseUrl.length) {
                if (baseUrl[0] !== "/")
                    baseUrl = "/" + baseUrl;
                if (baseUrl[baseUrl.length - 1] !== "/")
                    baseUrl = baseUrl + "/";
            }
            return baseUrl;
        };
        Router.prototype.setParser = function () {
            var _this = this;
            if (this.mode === "hash") {
                this.parser = new HashBasedRouting_1$1.default(this.routes);
                this.parseRoute(window.location.hash.replace("#", ""));
                window.addEventListener("hashchange", function () {
                    _this.parseRoute(window.location.hash.replace("#", ""));
                });
            }
            // if (this.baseUrl) this.parseRoute(this.baseUrl);
        };
        Router.prototype.parseRoute = function (url) {
            var _a = url.split('?'), path = _a[0], query = _a[1];
            var matchedRoute = this.parser.parse(path);
            if (!matchedRoute) {
                console.warn("Easyroute :: no routes matched \"" + url + "\"");
                return;
            }
            this.routeInfo = this.urlParser.createRouteObject(matchedRoute, path, query, url);
            this.previousRoute = this.currentRoute ? JSON.parse(JSON.stringify(this.currentRoute)) : undefined;
            this.currentRoute = {
                routeObject: matchedRoute,
                routeInfo: this.routeInfo
            };
            this.fireNavigation();
        };
        Router.prototype._beforeEach = function (to, from) {
            var _this = this;
            return new Promise(function (resolve) {
                if (!_this.beforeEach)
                    resolve();
                _this.beforeEach(to, from, resolve);
            });
        };
        Router.prototype._afterEach = function (to, from) {
            if (!this.afterEach)
                return;
            this.afterEach(to, from);
        };
        Router.prototype.fireNavigation = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.transitionService) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.transitionService.transitionOut()];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2: return [4 /*yield*/, this._beforeEach(this.currentRoute, this.previousRoute)];
                        case 3:
                            _a.sent();
                            if (this.afterUpdate)
                                this.afterUpdate();
                            if (!this.transitionService) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.transitionService.transitionIn()];
                        case 4:
                            _a.sent();
                            _a.label = 5;
                        case 5:
                            this._afterEach(this.currentRoute, this.previousRoute);
                            return [2 /*return*/];
                    }
                });
            });
        };
        return Router;
    }());
    exports.default = Router;
    });

    var Router = unwrapExports(dist);

    var router = new Router({
        base: "", // NOT required
        mode: "hash",
        transition: "xfade",
        routes: [
            {
                path: "/",
                component: Index,
                name: "Index"
            },
            {
                path: "/test*",
                component: Test,
                name: "Test",
                children: [
                    {
                        path: "nested*",
                        component: Nested,
                        children: [
                            {
                                path: "deep*",
                                component: NestedDeep,
                                children: [
                                    {
                                        path: "deeper",
                                        component: NestedDeeper
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                path: "/playground/:param1/params/:param2",
                component: ParamsPlayground,
                name: "ParamsPlayground"
            }
        ]
    });

    const app = new App({
        target: document.body,
        props: {
            name: "world",
            router
        }
    });

    window.app = app;

    exports.default = app;
    exports.router = router;

    return exports;

}({}));
//# sourceMappingURL=bundle.js.map
