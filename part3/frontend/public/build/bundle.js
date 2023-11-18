
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
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
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
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
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
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
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
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
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }
    class HtmlTag {
        constructor(is_svg = false) {
            this.is_svg = false;
            this.is_svg = is_svg;
            this.e = this.n = null;
        }
        c(html) {
            this.h(html);
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                if (this.is_svg)
                    this.e = svg_element(target.nodeName);
                else
                    this.e = element(target.nodeName);
                this.t = target;
                this.c(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * Creates an event dispatcher that can be used to dispatch [component events](/docs#template-syntax-component-directives-on-eventname).
     * Event dispatchers are functions that can take two arguments: `name` and `detail`.
     *
     * Component events created with `createEventDispatcher` create a
     * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
     * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
     * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
     * property and can contain any type of data.
     *
     * https://svelte.dev/docs#run-time-svelte-createeventdispatcher
     */
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
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
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
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
        else if (callback) {
            callback();
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
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
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
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
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.53.1' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    function construct_svelte_component_dev(component, props) {
        const error_message = 'this={...} of <svelte:component> should specify a Svelte component.';
        try {
            const instance = new component(props);
            if (!instance.$$ || !instance.$set || !instance.$on || !instance.$destroy) {
                throw new Error(error_message);
            }
            return instance;
        }
        catch (err) {
            const { message } = err;
            if (typeof message === 'string' && message.indexOf('is not a constructor') !== -1) {
                throw new Error(error_message);
            }
            else {
                throw err;
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/LoadingSpinner.svelte generated by Svelte v3.53.1 */

    const file$2 = "src/LoadingSpinner.svelte";

    function create_fragment$2(ctx) {
    	let div9;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let div2;
    	let t2;
    	let div3;
    	let t3;
    	let div4;
    	let t4;
    	let div5;
    	let t5;
    	let div6;
    	let t6;
    	let div7;
    	let t7;
    	let div8;

    	const block = {
    		c: function create() {
    			div9 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			t1 = space();
    			div2 = element("div");
    			t2 = space();
    			div3 = element("div");
    			t3 = space();
    			div4 = element("div");
    			t4 = space();
    			div5 = element("div");
    			t5 = space();
    			div6 = element("div");
    			t6 = space();
    			div7 = element("div");
    			t7 = space();
    			div8 = element("div");
    			attr_dev(div0, "class", "sk-cube sk-cube1 svelte-1h2tjla");
    			set_style(div0, "background-color", /*randomColor*/ ctx[1]);
    			add_location(div0, file$2, 6, 4, 178);
    			attr_dev(div1, "class", "sk-cube sk-cube2 svelte-1h2tjla");
    			set_style(div1, "background-color", /*randomColor*/ ctx[1]);
    			add_location(div1, file$2, 7, 4, 259);
    			attr_dev(div2, "class", "sk-cube sk-cube3 svelte-1h2tjla");
    			set_style(div2, "background-color", /*randomColor*/ ctx[1]);
    			add_location(div2, file$2, 8, 4, 340);
    			attr_dev(div3, "class", "sk-cube sk-cube4 svelte-1h2tjla");
    			set_style(div3, "background-color", /*randomColor*/ ctx[1]);
    			add_location(div3, file$2, 9, 4, 421);
    			attr_dev(div4, "class", "sk-cube sk-cube5 svelte-1h2tjla");
    			set_style(div4, "background-color", /*randomColor*/ ctx[1]);
    			add_location(div4, file$2, 10, 4, 502);
    			attr_dev(div5, "class", "sk-cube sk-cube6 svelte-1h2tjla");
    			set_style(div5, "background-color", /*randomColor*/ ctx[1]);
    			add_location(div5, file$2, 11, 4, 583);
    			attr_dev(div6, "class", "sk-cube sk-cube7 svelte-1h2tjla");
    			set_style(div6, "background-color", /*randomColor*/ ctx[1]);
    			add_location(div6, file$2, 12, 4, 664);
    			attr_dev(div7, "class", "sk-cube sk-cube8 svelte-1h2tjla");
    			set_style(div7, "background-color", /*randomColor*/ ctx[1]);
    			add_location(div7, file$2, 13, 4, 745);
    			attr_dev(div8, "class", "sk-cube sk-cube9 svelte-1h2tjla");
    			set_style(div8, "background-color", /*randomColor*/ ctx[1]);
    			add_location(div8, file$2, 14, 4, 826);
    			attr_dev(div9, "class", "sk-cube-grid svelte-1h2tjla");
    			set_style(div9, "width", /*hw*/ ctx[0] + "px");
    			set_style(div9, "height", /*hw*/ ctx[0] + "px");
    			add_location(div9, file$2, 5, 0, 110);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div9, anchor);
    			append_dev(div9, div0);
    			append_dev(div9, t0);
    			append_dev(div9, div1);
    			append_dev(div9, t1);
    			append_dev(div9, div2);
    			append_dev(div9, t2);
    			append_dev(div9, div3);
    			append_dev(div9, t3);
    			append_dev(div9, div4);
    			append_dev(div9, t4);
    			append_dev(div9, div5);
    			append_dev(div9, t5);
    			append_dev(div9, div6);
    			append_dev(div9, t6);
    			append_dev(div9, div7);
    			append_dev(div9, t7);
    			append_dev(div9, div8);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*hw*/ 1) {
    				set_style(div9, "width", /*hw*/ ctx[0] + "px");
    			}

    			if (dirty & /*hw*/ 1) {
    				set_style(div9, "height", /*hw*/ ctx[0] + "px");
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div9);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LoadingSpinner', slots, []);
    	let randomColor = "#" + ((1 << 24) * Math.random() | 0).toString(16);
    	let { hw = 90 } = $$props;
    	const writable_props = ['hw'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LoadingSpinner> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('hw' in $$props) $$invalidate(0, hw = $$props.hw);
    	};

    	$$self.$capture_state = () => ({ randomColor, hw });

    	$$self.$inject_state = $$props => {
    		if ('randomColor' in $$props) $$invalidate(1, randomColor = $$props.randomColor);
    		if ('hw' in $$props) $$invalidate(0, hw = $$props.hw);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [hw, randomColor];
    }

    class LoadingSpinner extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { hw: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LoadingSpinner",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get hw() {
    		throw new Error("<LoadingSpinner>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hw(value) {
    		throw new Error("<LoadingSpinner>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-table/src/SvelteTable.svelte generated by Svelte v3.53.1 */

    const { Object: Object_1, console: console_1$1 } = globals;
    const file$1 = "node_modules/svelte-table/src/SvelteTable.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[56] = list[i];
    	child_ctx[58] = i;
    	return child_ctx;
    }

    const get_expanded_slot_changes = dirty => ({ row: dirty[0] & /*c_rows*/ 8 });
    const get_expanded_slot_context = ctx => ({ row: /*row*/ ctx[56], n: /*n*/ ctx[58] });

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[59] = list[i];
    	child_ctx[61] = i;
    	return child_ctx;
    }

    const get_row_slot_changes = dirty => ({ row: dirty[0] & /*c_rows*/ 8 });
    const get_row_slot_context = ctx => ({ row: /*row*/ ctx[56], n: /*n*/ ctx[58] });

    function get_each_context_2$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[59] = list[i];
    	return child_ctx;
    }

    const get_header_slot_changes = dirty => ({
    	sortOrder: dirty[0] & /*sortOrder*/ 2,
    	sortBy: dirty[0] & /*sortBy*/ 1
    });

    const get_header_slot_context = ctx => ({
    	sortOrder: /*sortOrder*/ ctx[1],
    	sortBy: /*sortBy*/ ctx[0]
    });

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[59] = list[i];
    	child_ctx[64] = list;
    	child_ctx[65] = i;
    	return child_ctx;
    }

    function get_each_context_4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[66] = list[i];
    	return child_ctx;
    }

    // (272:4) {#if showFilterHeader}
    function create_if_block_6(ctx) {
    	let tr;
    	let t;
    	let each_value_3 = /*columns*/ ctx[4];
    	validate_each_argument(each_value_3);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	let if_block = /*showExpandIcon*/ ctx[11] && create_if_block_7(ctx);

    	const block = {
    		c: function create() {
    			tr = element("tr");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			if (if_block) if_block.c();
    			attr_dev(tr, "class", "svelte-dsaf7t");
    			add_location(tr, file$1, 272, 6, 7442);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tr, null);
    			}

    			append_dev(tr, t);
    			if (if_block) if_block.m(tr, null);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*asStringArray, columns, classNameInput, filterSelections, classNameSelect, filterValues*/ 75595796) {
    				each_value_3 = /*columns*/ ctx[4];
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tr, t);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_3.length;
    			}

    			if (/*showExpandIcon*/ ctx[11]) {
    				if (if_block) ; else {
    					if_block = create_if_block_7(ctx);
    					if_block.c();
    					if_block.m(tr, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_each(each_blocks, detaching);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(272:4) {#if showFilterHeader}",
    		ctx
    	});

    	return block;
    }

    // (281:58) 
    function create_if_block_9(ctx) {
    	let select;
    	let option;
    	let select_class_value;
    	let mounted;
    	let dispose;
    	let each_value_4 = /*filterValues*/ ctx[23][/*col*/ ctx[59].key];
    	validate_each_argument(each_value_4);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		each_blocks[i] = create_each_block_4(get_each_context_4(ctx, each_value_4, i));
    	}

    	function select_change_handler() {
    		/*select_change_handler*/ ctx[44].call(select, /*col*/ ctx[59]);
    	}

    	const block = {
    		c: function create() {
    			select = element("select");
    			option = element("option");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			option.__value = undefined;
    			option.value = option.__value;
    			add_location(option, file$1, 285, 16, 7971);
    			attr_dev(select, "class", select_class_value = "" + (null_to_empty(/*asStringArray*/ ctx[26](/*classNameSelect*/ ctx[15])) + " svelte-dsaf7t"));
    			if (/*filterSelections*/ ctx[2][/*col*/ ctx[59].key] === void 0) add_render_callback(select_change_handler);
    			add_location(select, file$1, 281, 14, 7817);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, select, anchor);
    			append_dev(select, option);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*filterSelections*/ ctx[2][/*col*/ ctx[59].key]);

    			if (!mounted) {
    				dispose = listen_dev(select, "change", select_change_handler);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*filterValues, columns*/ 8388624) {
    				each_value_4 = /*filterValues*/ ctx[23][/*col*/ ctx[59].key];
    				validate_each_argument(each_value_4);
    				let i;

    				for (i = 0; i < each_value_4.length; i += 1) {
    					const child_ctx = get_each_context_4(ctx, each_value_4, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_4.length;
    			}

    			if (dirty[0] & /*classNameSelect*/ 32768 && select_class_value !== (select_class_value = "" + (null_to_empty(/*asStringArray*/ ctx[26](/*classNameSelect*/ ctx[15])) + " svelte-dsaf7t"))) {
    				attr_dev(select, "class", select_class_value);
    			}

    			if (dirty[0] & /*filterSelections, columns, filterValues*/ 8388628) {
    				select_option(select, /*filterSelections*/ ctx[2][/*col*/ ctx[59].key]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(select);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(281:58) ",
    		ctx
    	});

    	return block;
    }

    // (276:12) {#if col.searchValue !== undefined}
    function create_if_block_8(ctx) {
    	let input;
    	let input_class_value;
    	let mounted;
    	let dispose;

    	function input_input_handler() {
    		/*input_input_handler*/ ctx[43].call(input, /*col*/ ctx[59]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "class", input_class_value = "" + (null_to_empty(/*asStringArray*/ ctx[26](/*classNameInput*/ ctx[16])) + " svelte-dsaf7t"));
    			add_location(input, file$1, 276, 14, 7606);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*filterSelections*/ ctx[2][/*col*/ ctx[59].key]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", input_input_handler);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*classNameInput*/ 65536 && input_class_value !== (input_class_value = "" + (null_to_empty(/*asStringArray*/ ctx[26](/*classNameInput*/ ctx[16])) + " svelte-dsaf7t"))) {
    				attr_dev(input, "class", input_class_value);
    			}

    			if (dirty[0] & /*filterSelections, columns, filterValues*/ 8388628 && input.value !== /*filterSelections*/ ctx[2][/*col*/ ctx[59].key]) {
    				set_input_value(input, /*filterSelections*/ ctx[2][/*col*/ ctx[59].key]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(276:12) {#if col.searchValue !== undefined}",
    		ctx
    	});

    	return block;
    }

    // (287:16) {#each filterValues[col.key] as option}
    function create_each_block_4(ctx) {
    	let option;
    	let t_value = /*option*/ ctx[66].name + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*option*/ ctx[66].value;
    			option.value = option.__value;
    			add_location(option, file$1, 287, 18, 8076);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*filterValues, columns*/ 8388624 && t_value !== (t_value = /*option*/ ctx[66].name + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*filterValues, columns*/ 8388624 && option_value_value !== (option_value_value = /*option*/ ctx[66].value)) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_4.name,
    		type: "each",
    		source: "(287:16) {#each filterValues[col.key] as option}",
    		ctx
    	});

    	return block;
    }

    // (274:8) {#each columns as col}
    function create_each_block_3(ctx) {
    	let th;
    	let th_class_value;

    	function select_block_type(ctx, dirty) {
    		if (/*col*/ ctx[59].searchValue !== undefined) return create_if_block_8;
    		if (/*filterValues*/ ctx[23][/*col*/ ctx[59].key] !== undefined) return create_if_block_9;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			th = element("th");
    			if (if_block) if_block.c();
    			attr_dev(th, "class", th_class_value = "" + (null_to_empty(/*asStringArray*/ ctx[26]([/*col*/ ctx[59].headerFilterClass])) + " svelte-dsaf7t"));
    			add_location(th, file$1, 274, 10, 7490);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    			if (if_block) if_block.m(th, null);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(th, null);
    				}
    			}

    			if (dirty[0] & /*columns, filterValues*/ 8388624 && th_class_value !== (th_class_value = "" + (null_to_empty(/*asStringArray*/ ctx[26]([/*col*/ ctx[59].headerFilterClass])) + " svelte-dsaf7t"))) {
    				attr_dev(th, "class", th_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);

    			if (if_block) {
    				if_block.d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(274:8) {#each columns as col}",
    		ctx
    	});

    	return block;
    }

    // (294:8) {#if showExpandIcon}
    function create_if_block_7(ctx) {
    	let th;

    	const block = {
    		c: function create() {
    			th = element("th");
    			add_location(th, file$1, 294, 10, 8272);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(294:8) {#if showExpandIcon}",
    		ctx
    	});

    	return block;
    }

    // (314:35) 
    function create_if_block_5$1(ctx) {
    	let html_tag;
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag(false);
    			html_anchor = empty();
    			html_tag.a = html_anchor;
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(/*iconSortable*/ ctx[8], target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*iconSortable*/ 256) html_tag.p(/*iconSortable*/ ctx[8]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$1.name,
    		type: "if",
    		source: "(314:35) ",
    		ctx
    	});

    	return block;
    }

    // (312:12) {#if sortBy === col.key}
    function create_if_block_4$1(ctx) {
    	let html_tag;

    	let raw_value = (/*sortOrder*/ ctx[1] === 1
    	? /*iconAsc*/ ctx[6]
    	: /*iconDesc*/ ctx[7]) + "";

    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag(false);
    			html_anchor = empty();
    			html_tag.a = html_anchor;
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(raw_value, target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*sortOrder, iconAsc, iconDesc*/ 194 && raw_value !== (raw_value = (/*sortOrder*/ ctx[1] === 1
    			? /*iconAsc*/ ctx[6]
    			: /*iconDesc*/ ctx[7]) + "")) html_tag.p(raw_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(312:12) {#if sortBy === col.key}",
    		ctx
    	});

    	return block;
    }

    // (301:8) {#each columns as col}
    function create_each_block_2$1(ctx) {
    	let th;
    	let t0_value = /*col*/ ctx[59].title + "";
    	let t0;
    	let t1;
    	let th_class_value;
    	let mounted;
    	let dispose;

    	function select_block_type_1(ctx, dirty) {
    		if (/*sortBy*/ ctx[0] === /*col*/ ctx[59].key) return create_if_block_4$1;
    		if (/*col*/ ctx[59].sortable) return create_if_block_5$1;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[45](/*col*/ ctx[59], ...args);
    	}

    	function keypress_handler(...args) {
    		return /*keypress_handler*/ ctx[46](/*col*/ ctx[59], ...args);
    	}

    	const block = {
    		c: function create() {
    			th = element("th");
    			t0 = text(t0_value);
    			t1 = space();
    			if (if_block) if_block.c();
    			attr_dev(th, "class", th_class_value = "" + (null_to_empty(/*asStringArray*/ ctx[26]([/*col*/ ctx[59].sortable ? "isSortable" : "", /*col*/ ctx[59].headerClass])) + " svelte-dsaf7t"));
    			attr_dev(th, "tabindex", "0");
    			add_location(th, file$1, 301, 10, 8420);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    			append_dev(th, t0);
    			append_dev(th, t1);
    			if (if_block) if_block.m(th, null);

    			if (!mounted) {
    				dispose = [
    					listen_dev(th, "click", click_handler, false, false, false),
    					listen_dev(th, "keypress", keypress_handler, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*columns*/ 16 && t0_value !== (t0_value = /*col*/ ctx[59].title + "")) set_data_dev(t0, t0_value);

    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(th, null);
    				}
    			}

    			if (dirty[0] & /*columns, filterValues*/ 8388624 && th_class_value !== (th_class_value = "" + (null_to_empty(/*asStringArray*/ ctx[26]([/*col*/ ctx[59].sortable ? "isSortable" : "", /*col*/ ctx[59].headerClass])) + " svelte-dsaf7t"))) {
    				attr_dev(th, "class", th_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);

    			if (if_block) {
    				if_block.d();
    			}

    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2$1.name,
    		type: "each",
    		source: "(301:8) {#each columns as col}",
    		ctx
    	});

    	return block;
    }

    // (319:8) {#if showExpandIcon}
    function create_if_block_3$1(ctx) {
    	let th;

    	const block = {
    		c: function create() {
    			th = element("th");
    			add_location(th, file$1, 319, 10, 9015);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(319:8) {#if showExpandIcon}",
    		ctx
    	});

    	return block;
    }

    // (299:45)         
    function fallback_block_1(ctx) {
    	let tr;
    	let t;
    	let each_value_2 = /*columns*/ ctx[4];
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2$1(get_each_context_2$1(ctx, each_value_2, i));
    	}

    	let if_block = /*showExpandIcon*/ ctx[11] && create_if_block_3$1(ctx);

    	const block = {
    		c: function create() {
    			tr = element("tr");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			if (if_block) if_block.c();
    			add_location(tr, file$1, 299, 6, 8372);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tr, null);
    			}

    			append_dev(tr, t);
    			if (if_block) if_block.m(tr, null);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*asStringArray, columns, handleClickCol, sortOrder, iconAsc, iconDesc, sortBy, iconSortable*/ 201327059) {
    				each_value_2 = /*columns*/ ctx[4];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2$1(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tr, t);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}

    			if (/*showExpandIcon*/ ctx[11]) {
    				if (if_block) ; else {
    					if_block = create_if_block_3$1(ctx);
    					if_block.c();
    					if_block.m(tr, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_each(each_blocks, detaching);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_1.name,
    		type: "fallback",
    		source: "(299:45)         ",
    		ctx
    	});

    	return block;
    }

    // (361:14) {:else}
    function create_else_block$1(ctx) {
    	let html_tag;

    	let raw_value = (/*col*/ ctx[59].renderValue
    	? /*col*/ ctx[59].renderValue(/*row*/ ctx[56])
    	: /*col*/ ctx[59].value(/*row*/ ctx[56])) + "";

    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag(false);
    			html_anchor = empty();
    			html_tag.a = html_anchor;
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(raw_value, target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*columns, c_rows*/ 24 && raw_value !== (raw_value = (/*col*/ ctx[59].renderValue
    			? /*col*/ ctx[59].renderValue(/*row*/ ctx[56])
    			: /*col*/ ctx[59].value(/*row*/ ctx[56])) + "")) html_tag.p(raw_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(361:14) {:else}",
    		ctx
    	});

    	return block;
    }

    // (354:14) {#if col.renderComponent}
    function create_if_block_2$1(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		/*col*/ ctx[59].renderComponent.props || {},
    		{ row: /*row*/ ctx[56] },
    		{ col: /*col*/ ctx[59] }
    	];

    	var switch_value = /*col*/ ctx[59].renderComponent.component || /*col*/ ctx[59].renderComponent;

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty[0] & /*columns, c_rows*/ 24)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty[0] & /*columns*/ 16 && get_spread_object(/*col*/ ctx[59].renderComponent.props || {}),
    					dirty[0] & /*c_rows*/ 8 && { row: /*row*/ ctx[56] },
    					dirty[0] & /*columns*/ 16 && { col: /*col*/ ctx[59] }
    				])
    			: {};

    			if (switch_value !== (switch_value = /*col*/ ctx[59].renderComponent.component || /*col*/ ctx[59].renderComponent)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
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
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(354:14) {#if col.renderComponent}",
    		ctx
    	});

    	return block;
    }

    // (341:10) {#each columns as col, colIndex}
    function create_each_block_1$1(ctx) {
    	let td;
    	let current_block_type_index;
    	let if_block;
    	let td_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block_2$1, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type_2(ctx, dirty) {
    		if (/*col*/ ctx[59].renderComponent) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_2(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	function click_handler_1(...args) {
    		return /*click_handler_1*/ ctx[47](/*row*/ ctx[56], /*col*/ ctx[59], ...args);
    	}

    	function keypress_handler_1(...args) {
    		return /*keypress_handler_1*/ ctx[48](/*row*/ ctx[56], /*col*/ ctx[59], ...args);
    	}

    	const block = {
    		c: function create() {
    			td = element("td");
    			if_block.c();

    			attr_dev(td, "class", td_class_value = "" + (null_to_empty(/*asStringArray*/ ctx[26]([
    				typeof /*col*/ ctx[59].class === "string"
    				? /*col*/ ctx[59].class
    				: null,
    				typeof /*col*/ ctx[59].class === "function"
    				? /*col*/ ctx[59].class(/*row*/ ctx[56], /*n*/ ctx[58], /*colIndex*/ ctx[61])
    				: null,
    				/*classNameCell*/ ctx[18]
    			])) + " svelte-dsaf7t"));

    			add_location(td, file$1, 341, 12, 9761);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			if_blocks[current_block_type_index].m(td, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(td, "click", click_handler_1, false, false, false),
    					listen_dev(td, "keypress", keypress_handler_1, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_2(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(td, null);
    			}

    			if (!current || dirty[0] & /*columns, c_rows, classNameCell, filterValues*/ 8650776 && td_class_value !== (td_class_value = "" + (null_to_empty(/*asStringArray*/ ctx[26]([
    				typeof /*col*/ ctx[59].class === "string"
    				? /*col*/ ctx[59].class
    				: null,
    				typeof /*col*/ ctx[59].class === "function"
    				? /*col*/ ctx[59].class(/*row*/ ctx[56], /*n*/ ctx[58], /*colIndex*/ ctx[61])
    				: null,
    				/*classNameCell*/ ctx[18]
    			])) + " svelte-dsaf7t"))) {
    				attr_dev(td, "class", td_class_value);
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
    			if (detaching) detach_dev(td);
    			if_blocks[current_block_type_index].d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(341:10) {#each columns as col, colIndex}",
    		ctx
    	});

    	return block;
    }

    // (366:10) {#if showExpandIcon}
    function create_if_block_1$1(ctx) {
    	let td;

    	let raw_value = (/*row*/ ctx[56].$expanded
    	? /*iconExpand*/ ctx[9]
    	: /*iconExpanded*/ ctx[10]) + "";

    	let td_class_value;
    	let mounted;
    	let dispose;

    	function click_handler_2(...args) {
    		return /*click_handler_2*/ ctx[49](/*row*/ ctx[56], ...args);
    	}

    	function keypress_handler_2(...args) {
    		return /*keypress_handler_2*/ ctx[50](/*row*/ ctx[56], ...args);
    	}

    	const block = {
    		c: function create() {
    			td = element("td");
    			attr_dev(td, "class", td_class_value = "" + (null_to_empty(/*asStringArray*/ ctx[26](["isClickable", /*classNameCellExpand*/ ctx[22]])) + " svelte-dsaf7t"));
    			attr_dev(td, "tabindex", "0");
    			attr_dev(td, "role", "button");
    			add_location(td, file$1, 366, 12, 10719);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			td.innerHTML = raw_value;

    			if (!mounted) {
    				dispose = [
    					listen_dev(td, "click", click_handler_2, false, false, false),
    					listen_dev(td, "keypress", keypress_handler_2, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*c_rows, iconExpand, iconExpanded*/ 1544 && raw_value !== (raw_value = (/*row*/ ctx[56].$expanded
    			? /*iconExpand*/ ctx[9]
    			: /*iconExpanded*/ ctx[10]) + "")) td.innerHTML = raw_value;
    			if (dirty[0] & /*classNameCellExpand*/ 4194304 && td_class_value !== (td_class_value = "" + (null_to_empty(/*asStringArray*/ ctx[26](["isClickable", /*classNameCellExpand*/ ctx[22]])) + " svelte-dsaf7t"))) {
    				attr_dev(td, "class", td_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(366:10) {#if showExpandIcon}",
    		ctx
    	});

    	return block;
    }

    // (378:8) {#if row.$expanded}
    function create_if_block$1(ctx) {
    	let tr;
    	let td;
    	let tr_class_value;
    	let current;
    	const expanded_slot_template = /*#slots*/ ctx[42].expanded;
    	const expanded_slot = create_slot(expanded_slot_template, ctx, /*$$scope*/ ctx[41], get_expanded_slot_context);

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td = element("td");
    			if (expanded_slot) expanded_slot.c();
    			attr_dev(td, "colspan", /*colspan*/ ctx[24]);
    			add_location(td, file$1, 379, 13, 11230);
    			attr_dev(tr, "class", tr_class_value = "" + (null_to_empty(/*asStringArray*/ ctx[26](/*classNameExpandedContent*/ ctx[21])) + " svelte-dsaf7t"));
    			add_location(tr, file$1, 378, 10, 11164);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td);

    			if (expanded_slot) {
    				expanded_slot.m(td, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (expanded_slot) {
    				if (expanded_slot.p && (!current || dirty[0] & /*c_rows*/ 8 | dirty[1] & /*$$scope*/ 1024)) {
    					update_slot_base(
    						expanded_slot,
    						expanded_slot_template,
    						ctx,
    						/*$$scope*/ ctx[41],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[41])
    						: get_slot_changes(expanded_slot_template, /*$$scope*/ ctx[41], dirty, get_expanded_slot_changes),
    						get_expanded_slot_context
    					);
    				}
    			}

    			if (!current || dirty[0] & /*colspan*/ 16777216) {
    				attr_dev(td, "colspan", /*colspan*/ ctx[24]);
    			}

    			if (!current || dirty[0] & /*classNameExpandedContent*/ 2097152 && tr_class_value !== (tr_class_value = "" + (null_to_empty(/*asStringArray*/ ctx[26](/*classNameExpandedContent*/ ctx[21])) + " svelte-dsaf7t"))) {
    				attr_dev(tr, "class", tr_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(expanded_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(expanded_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			if (expanded_slot) expanded_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(378:8) {#if row.$expanded}",
    		ctx
    	});

    	return block;
    }

    // (328:33)           
    function fallback_block(ctx) {
    	let tr;
    	let t0;
    	let tr_class_value;
    	let tr_tabindex_value;
    	let t1;
    	let t2;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*columns*/ ctx[4];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	let if_block0 = /*showExpandIcon*/ ctx[11] && create_if_block_1$1(ctx);

    	function click_handler_3(...args) {
    		return /*click_handler_3*/ ctx[51](/*row*/ ctx[56], ...args);
    	}

    	function keypress_handler_3(...args) {
    		return /*keypress_handler_3*/ ctx[52](/*row*/ ctx[56], ...args);
    	}

    	let if_block1 = /*row*/ ctx[56].$expanded && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			tr = element("tr");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			t2 = space();

    			attr_dev(tr, "class", tr_class_value = "" + (null_to_empty(/*asStringArray*/ ctx[26]([
    				typeof /*classNameRow*/ ctx[17] === "string"
    				? /*classNameRow*/ ctx[17]
    				: null,
    				typeof /*classNameRow*/ ctx[17] === "function"
    				? /*classNameRow*/ ctx[17](/*row*/ ctx[56], /*n*/ ctx[58])
    				: null,
    				,/*row*/ ctx[56].$expanded && /*classNameRowExpanded*/ ctx[20],
    				/*row*/ ctx[56].$selected && /*classNameRowSelected*/ ctx[19]
    			])) + " svelte-dsaf7t"));

    			attr_dev(tr, "tabindex", tr_tabindex_value = /*selectOnClick*/ ctx[5] ? "0" : null);
    			add_location(tr, file$1, 328, 8, 9200);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tr, null);
    			}

    			append_dev(tr, t0);
    			if (if_block0) if_block0.m(tr, null);
    			insert_dev(target, t1, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t2, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(tr, "click", click_handler_3, false, false, false),
    					listen_dev(tr, "keypress", keypress_handler_3, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*asStringArray, columns, c_rows, classNameCell, handleClickCell*/ 1141112856) {
    				each_value_1 = /*columns*/ ctx[4];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(tr, t0);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (/*showExpandIcon*/ ctx[11]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$1(ctx);
    					if_block0.c();
    					if_block0.m(tr, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (!current || dirty[0] & /*classNameRow, c_rows, classNameRowExpanded, classNameRowSelected*/ 1703944 && tr_class_value !== (tr_class_value = "" + (null_to_empty(/*asStringArray*/ ctx[26]([
    				typeof /*classNameRow*/ ctx[17] === "string"
    				? /*classNameRow*/ ctx[17]
    				: null,
    				typeof /*classNameRow*/ ctx[17] === "function"
    				? /*classNameRow*/ ctx[17](/*row*/ ctx[56], /*n*/ ctx[58])
    				: null,
    				,/*row*/ ctx[56].$expanded && /*classNameRowExpanded*/ ctx[20],
    				/*row*/ ctx[56].$selected && /*classNameRowSelected*/ ctx[19]
    			])) + " svelte-dsaf7t"))) {
    				attr_dev(tr, "class", tr_class_value);
    			}

    			if (!current || dirty[0] & /*selectOnClick*/ 32 && tr_tabindex_value !== (tr_tabindex_value = /*selectOnClick*/ ctx[5] ? "0" : null)) {
    				attr_dev(tr, "tabindex", tr_tabindex_value);
    			}

    			if (/*row*/ ctx[56].$expanded) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*c_rows*/ 8) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(t2.parentNode, t2);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_each(each_blocks, detaching);
    			if (if_block0) if_block0.d();
    			if (detaching) detach_dev(t1);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t2);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(328:33)           ",
    		ctx
    	});

    	return block;
    }

    // (327:4) {#each c_rows as row, n}
    function create_each_block$1(ctx) {
    	let current;
    	const row_slot_template = /*#slots*/ ctx[42].row;
    	const row_slot = create_slot(row_slot_template, ctx, /*$$scope*/ ctx[41], get_row_slot_context);
    	const row_slot_or_fallback = row_slot || fallback_block(ctx);

    	const block = {
    		c: function create() {
    			if (row_slot_or_fallback) row_slot_or_fallback.c();
    		},
    		m: function mount(target, anchor) {
    			if (row_slot_or_fallback) {
    				row_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (row_slot) {
    				if (row_slot.p && (!current || dirty[0] & /*c_rows*/ 8 | dirty[1] & /*$$scope*/ 1024)) {
    					update_slot_base(
    						row_slot,
    						row_slot_template,
    						ctx,
    						/*$$scope*/ ctx[41],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[41])
    						: get_slot_changes(row_slot_template, /*$$scope*/ ctx[41], dirty, get_row_slot_changes),
    						get_row_slot_context
    					);
    				}
    			} else {
    				if (row_slot_or_fallback && row_slot_or_fallback.p && (!current || dirty[0] & /*classNameExpandedContent, colspan, c_rows, classNameRow, classNameRowExpanded, classNameRowSelected, selectOnClick, classNameCellExpand, iconExpand, iconExpanded, showExpandIcon, columns, classNameCell*/ 25038392 | dirty[1] & /*$$scope*/ 1024)) {
    					row_slot_or_fallback.p(ctx, !current ? [-1, -1, -1] : dirty);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (row_slot_or_fallback) row_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(327:4) {#each c_rows as row, n}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let table;
    	let thead;
    	let t0;
    	let thead_class_value;
    	let t1;
    	let tbody;
    	let tbody_class_value;
    	let table_class_value;
    	let current;
    	let if_block = /*showFilterHeader*/ ctx[25] && create_if_block_6(ctx);
    	const header_slot_template = /*#slots*/ ctx[42].header;
    	const header_slot = create_slot(header_slot_template, ctx, /*$$scope*/ ctx[41], get_header_slot_context);
    	const header_slot_or_fallback = header_slot || fallback_block_1(ctx);
    	let each_value = /*c_rows*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			table = element("table");
    			thead = element("thead");
    			if (if_block) if_block.c();
    			t0 = space();
    			if (header_slot_or_fallback) header_slot_or_fallback.c();
    			t1 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(thead, "class", thead_class_value = "" + (null_to_empty(/*asStringArray*/ ctx[26](/*classNameThead*/ ctx[13])) + " svelte-dsaf7t"));
    			add_location(thead, file$1, 270, 2, 7361);
    			attr_dev(tbody, "class", tbody_class_value = "" + (null_to_empty(/*asStringArray*/ ctx[26](/*classNameTbody*/ ctx[14])) + " svelte-dsaf7t"));
    			add_location(tbody, file$1, 325, 2, 9080);
    			attr_dev(table, "class", table_class_value = "" + (null_to_empty(/*asStringArray*/ ctx[26](/*classNameTable*/ ctx[12])) + " svelte-dsaf7t"));
    			add_location(table, file$1, 269, 0, 7312);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);
    			append_dev(table, thead);
    			if (if_block) if_block.m(thead, null);
    			append_dev(thead, t0);

    			if (header_slot_or_fallback) {
    				header_slot_or_fallback.m(thead, null);
    			}

    			append_dev(table, t1);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*showFilterHeader*/ ctx[25]) if_block.p(ctx, dirty);

    			if (header_slot) {
    				if (header_slot.p && (!current || dirty[0] & /*sortOrder, sortBy*/ 3 | dirty[1] & /*$$scope*/ 1024)) {
    					update_slot_base(
    						header_slot,
    						header_slot_template,
    						ctx,
    						/*$$scope*/ ctx[41],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[41])
    						: get_slot_changes(header_slot_template, /*$$scope*/ ctx[41], dirty, get_header_slot_changes),
    						get_header_slot_context
    					);
    				}
    			} else {
    				if (header_slot_or_fallback && header_slot_or_fallback.p && (!current || dirty[0] & /*showExpandIcon, columns, sortOrder, iconAsc, iconDesc, sortBy, iconSortable*/ 2515)) {
    					header_slot_or_fallback.p(ctx, !current ? [-1, -1, -1] : dirty);
    				}
    			}

    			if (!current || dirty[0] & /*classNameThead*/ 8192 && thead_class_value !== (thead_class_value = "" + (null_to_empty(/*asStringArray*/ ctx[26](/*classNameThead*/ ctx[13])) + " svelte-dsaf7t"))) {
    				attr_dev(thead, "class", thead_class_value);
    			}

    			if (dirty[0] & /*asStringArray, classNameExpandedContent, colspan, c_rows, classNameRow, classNameRowExpanded, classNameRowSelected, selectOnClick, handleClickRow, classNameCellExpand, handleClickExpand, iconExpand, iconExpanded, showExpandIcon, columns, classNameCell, handleClickCell*/ 1971195448 | dirty[1] & /*$$scope*/ 1024) {
    				each_value = /*c_rows*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty[0] & /*classNameTbody*/ 16384 && tbody_class_value !== (tbody_class_value = "" + (null_to_empty(/*asStringArray*/ ctx[26](/*classNameTbody*/ ctx[14])) + " svelte-dsaf7t"))) {
    				attr_dev(tbody, "class", tbody_class_value);
    			}

    			if (!current || dirty[0] & /*classNameTable*/ 4096 && table_class_value !== (table_class_value = "" + (null_to_empty(/*asStringArray*/ ctx[26](/*classNameTable*/ ctx[12])) + " svelte-dsaf7t"))) {
    				attr_dev(table, "class", table_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header_slot_or_fallback, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header_slot_or_fallback, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			if (if_block) if_block.d();
    			if (header_slot_or_fallback) header_slot_or_fallback.d(detaching);
    			destroy_each(each_blocks, detaching);
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
    	let colspan;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SvelteTable', slots, ['header','expanded','row']);
    	let { columns } = $$props;
    	let { rows } = $$props;
    	let { c_rows = undefined } = $$props;
    	let { sortOrders = [1, -1] } = $$props;
    	let { sortBy = "" } = $$props;
    	let { sortOrder = sortOrders?.[0] || 1 } = $$props;
    	let { filterSelections = {} } = $$props;
    	let { expanded = [] } = $$props;
    	let { selected = [] } = $$props;
    	let { expandRowKey = null } = $$props;
    	let { rowKey = expandRowKey } = $$props;
    	let { expandSingle = false } = $$props;
    	let { selectSingle = false } = $$props;
    	let { selectOnClick = false } = $$props;
    	let { iconAsc = "▲" } = $$props;
    	let { iconDesc = "▼" } = $$props;
    	let { iconSortable = "" } = $$props;
    	let { iconExpand = "▼" } = $$props;
    	let { iconExpanded = "▲" } = $$props;
    	let { showExpandIcon = false } = $$props;
    	let { classNameTable = "" } = $$props;
    	let { classNameThead = "" } = $$props;
    	let { classNameTbody = "" } = $$props;
    	let { classNameSelect = "" } = $$props;
    	let { classNameInput = "" } = $$props;
    	let { classNameRow = null } = $$props;
    	let { classNameCell = "" } = $$props;
    	let { classNameRowSelected = null } = $$props;
    	let { classNameRowExpanded = null } = $$props;
    	let { classNameExpandedContent = "" } = $$props;
    	let { classNameCellExpand = "" } = $$props;
    	const dispatch = createEventDispatcher();

    	/** @type {function}*/
    	let sortFunction = () => "";

    	// Validation
    	if (!Array.isArray(expanded)) throw "'expanded' needs to be an array";

    	if (!Array.isArray(selected)) throw "'selection' needs to be an array";

    	if (expandRowKey !== null) {
    		console.warn("'expandRowKey' is deprecated in favour of 'rowKey'");
    	}

    	if (classNameRowSelected && !rowKey) {
    		console.error("'rowKey' is needed to use 'classNameRowSelected'");
    	}

    	let showFilterHeader = columns.some(c => {
    		// check if there are any filter or search headers
    		return c.filterOptions !== undefined || c.searchValue !== undefined;
    	});

    	let filterValues = {};

    	/** @type {Record<string | number | symbol, TableColumn<any>>}*/
    	let columnByKey;

    	const asStringArray = v => [].concat(v).filter(v => v !== null && typeof v === "string" && v !== "").join(" ");

    	const calculateFilterValues = () => {
    		$$invalidate(23, filterValues = {});

    		columns.forEach(c => {
    			if (typeof c.filterOptions === "function") {
    				$$invalidate(23, filterValues[c.key] = c.filterOptions(rows), filterValues);
    			} else if (Array.isArray(c.filterOptions)) {
    				// if array of strings is provided, use it for name and value
    				$$invalidate(23, filterValues[c.key] = c.filterOptions.map(val => ({ name: val, value: val })), filterValues);
    			}
    		});
    	};

    	const updateSortOrder = colKey => {
    		return colKey === sortBy
    		? sortOrders[(sortOrders.findIndex(o => o === sortOrder) + 1) % sortOrders.length]
    		: sortOrders[0];
    	};

    	const handleClickCol = (event, col) => {
    		if (col.sortable) {
    			$$invalidate(1, sortOrder = updateSortOrder(col.key));
    			$$invalidate(0, sortBy = sortOrder ? col.key : undefined);
    		}

    		dispatch("clickCol", { event, col, key: col.key });
    	};

    	const handleClickRow = (event, row) => {
    		if (selectOnClick) {
    			if (selectSingle) {
    				// replace selection is default behaviour
    				if (selected.includes(row[rowKey])) {
    					$$invalidate(32, selected = []);
    				} else {
    					$$invalidate(32, selected = [row[rowKey]]);
    				}
    			} else {
    				if (selected.includes(row[rowKey])) {
    					$$invalidate(32, selected = selected.filter(r => r != row[rowKey]));
    				} else {
    					$$invalidate(32, selected = [...selected, row[rowKey]].sort());
    				}
    			}
    		}

    		dispatch("clickRow", { event, row });
    	};

    	const handleClickExpand = (event, row) => {
    		row.$expanded = !row.$expanded;
    		const keyVal = row[rowKey];

    		if (expandSingle && row.$expanded) {
    			$$invalidate(31, expanded = [keyVal]);
    		} else if (expandSingle) {
    			$$invalidate(31, expanded = []);
    		} else if (!row.$expanded) {
    			$$invalidate(31, expanded = expanded.filter(r => r != keyVal));
    		} else {
    			$$invalidate(31, expanded = [...expanded, keyVal]);
    		}

    		dispatch("clickExpand", { event, row });
    	};

    	const handleClickCell = (event, row, key) => {
    		dispatch("clickCell", { event, row, key });
    	};

    	$$self.$$.on_mount.push(function () {
    		if (columns === undefined && !('columns' in $$props || $$self.$$.bound[$$self.$$.props['columns']])) {
    			console_1$1.warn("<SvelteTable> was created without expected prop 'columns'");
    		}

    		if (rows === undefined && !('rows' in $$props || $$self.$$.bound[$$self.$$.props['rows']])) {
    			console_1$1.warn("<SvelteTable> was created without expected prop 'rows'");
    		}
    	});

    	const writable_props = [
    		'columns',
    		'rows',
    		'c_rows',
    		'sortOrders',
    		'sortBy',
    		'sortOrder',
    		'filterSelections',
    		'expanded',
    		'selected',
    		'expandRowKey',
    		'rowKey',
    		'expandSingle',
    		'selectSingle',
    		'selectOnClick',
    		'iconAsc',
    		'iconDesc',
    		'iconSortable',
    		'iconExpand',
    		'iconExpanded',
    		'showExpandIcon',
    		'classNameTable',
    		'classNameThead',
    		'classNameTbody',
    		'classNameSelect',
    		'classNameInput',
    		'classNameRow',
    		'classNameCell',
    		'classNameRowSelected',
    		'classNameRowExpanded',
    		'classNameExpandedContent',
    		'classNameCellExpand'
    	];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<SvelteTable> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler(col) {
    		filterSelections[col.key] = this.value;
    		$$invalidate(2, filterSelections);
    		$$invalidate(23, filterValues);
    		$$invalidate(4, columns);
    	}

    	function select_change_handler(col) {
    		filterSelections[col.key] = select_value(this);
    		$$invalidate(2, filterSelections);
    		$$invalidate(23, filterValues);
    		$$invalidate(4, columns);
    	}

    	const click_handler = (col, e) => handleClickCol(e, col);
    	const keypress_handler = (col, e) => e.key === "Enter" && handleClickCol(e, col);
    	const click_handler_1 = (row, col, e) => handleClickCell(e, row, col.key);
    	const keypress_handler_1 = (row, col, e) => e.key === "Enter" && handleClickCell(e, row, col.key);
    	const click_handler_2 = (row, e) => handleClickExpand(e, row);
    	const keypress_handler_2 = (row, e) => e.key === "Enter" && handleClickExpand(e, row);
    	const click_handler_3 = (row, e) => handleClickRow(e, row);
    	const keypress_handler_3 = (row, e) => e.key === "Enter" && handleClickRow(e, row);

    	$$self.$$set = $$props => {
    		if ('columns' in $$props) $$invalidate(4, columns = $$props.columns);
    		if ('rows' in $$props) $$invalidate(33, rows = $$props.rows);
    		if ('c_rows' in $$props) $$invalidate(3, c_rows = $$props.c_rows);
    		if ('sortOrders' in $$props) $$invalidate(34, sortOrders = $$props.sortOrders);
    		if ('sortBy' in $$props) $$invalidate(0, sortBy = $$props.sortBy);
    		if ('sortOrder' in $$props) $$invalidate(1, sortOrder = $$props.sortOrder);
    		if ('filterSelections' in $$props) $$invalidate(2, filterSelections = $$props.filterSelections);
    		if ('expanded' in $$props) $$invalidate(31, expanded = $$props.expanded);
    		if ('selected' in $$props) $$invalidate(32, selected = $$props.selected);
    		if ('expandRowKey' in $$props) $$invalidate(35, expandRowKey = $$props.expandRowKey);
    		if ('rowKey' in $$props) $$invalidate(36, rowKey = $$props.rowKey);
    		if ('expandSingle' in $$props) $$invalidate(37, expandSingle = $$props.expandSingle);
    		if ('selectSingle' in $$props) $$invalidate(38, selectSingle = $$props.selectSingle);
    		if ('selectOnClick' in $$props) $$invalidate(5, selectOnClick = $$props.selectOnClick);
    		if ('iconAsc' in $$props) $$invalidate(6, iconAsc = $$props.iconAsc);
    		if ('iconDesc' in $$props) $$invalidate(7, iconDesc = $$props.iconDesc);
    		if ('iconSortable' in $$props) $$invalidate(8, iconSortable = $$props.iconSortable);
    		if ('iconExpand' in $$props) $$invalidate(9, iconExpand = $$props.iconExpand);
    		if ('iconExpanded' in $$props) $$invalidate(10, iconExpanded = $$props.iconExpanded);
    		if ('showExpandIcon' in $$props) $$invalidate(11, showExpandIcon = $$props.showExpandIcon);
    		if ('classNameTable' in $$props) $$invalidate(12, classNameTable = $$props.classNameTable);
    		if ('classNameThead' in $$props) $$invalidate(13, classNameThead = $$props.classNameThead);
    		if ('classNameTbody' in $$props) $$invalidate(14, classNameTbody = $$props.classNameTbody);
    		if ('classNameSelect' in $$props) $$invalidate(15, classNameSelect = $$props.classNameSelect);
    		if ('classNameInput' in $$props) $$invalidate(16, classNameInput = $$props.classNameInput);
    		if ('classNameRow' in $$props) $$invalidate(17, classNameRow = $$props.classNameRow);
    		if ('classNameCell' in $$props) $$invalidate(18, classNameCell = $$props.classNameCell);
    		if ('classNameRowSelected' in $$props) $$invalidate(19, classNameRowSelected = $$props.classNameRowSelected);
    		if ('classNameRowExpanded' in $$props) $$invalidate(20, classNameRowExpanded = $$props.classNameRowExpanded);
    		if ('classNameExpandedContent' in $$props) $$invalidate(21, classNameExpandedContent = $$props.classNameExpandedContent);
    		if ('classNameCellExpand' in $$props) $$invalidate(22, classNameCellExpand = $$props.classNameCellExpand);
    		if ('$$scope' in $$props) $$invalidate(41, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		columns,
    		rows,
    		c_rows,
    		sortOrders,
    		sortBy,
    		sortOrder,
    		filterSelections,
    		expanded,
    		selected,
    		expandRowKey,
    		rowKey,
    		expandSingle,
    		selectSingle,
    		selectOnClick,
    		iconAsc,
    		iconDesc,
    		iconSortable,
    		iconExpand,
    		iconExpanded,
    		showExpandIcon,
    		classNameTable,
    		classNameThead,
    		classNameTbody,
    		classNameSelect,
    		classNameInput,
    		classNameRow,
    		classNameCell,
    		classNameRowSelected,
    		classNameRowExpanded,
    		classNameExpandedContent,
    		classNameCellExpand,
    		dispatch,
    		sortFunction,
    		showFilterHeader,
    		filterValues,
    		columnByKey,
    		asStringArray,
    		calculateFilterValues,
    		updateSortOrder,
    		handleClickCol,
    		handleClickRow,
    		handleClickExpand,
    		handleClickCell,
    		colspan
    	});

    	$$self.$inject_state = $$props => {
    		if ('columns' in $$props) $$invalidate(4, columns = $$props.columns);
    		if ('rows' in $$props) $$invalidate(33, rows = $$props.rows);
    		if ('c_rows' in $$props) $$invalidate(3, c_rows = $$props.c_rows);
    		if ('sortOrders' in $$props) $$invalidate(34, sortOrders = $$props.sortOrders);
    		if ('sortBy' in $$props) $$invalidate(0, sortBy = $$props.sortBy);
    		if ('sortOrder' in $$props) $$invalidate(1, sortOrder = $$props.sortOrder);
    		if ('filterSelections' in $$props) $$invalidate(2, filterSelections = $$props.filterSelections);
    		if ('expanded' in $$props) $$invalidate(31, expanded = $$props.expanded);
    		if ('selected' in $$props) $$invalidate(32, selected = $$props.selected);
    		if ('expandRowKey' in $$props) $$invalidate(35, expandRowKey = $$props.expandRowKey);
    		if ('rowKey' in $$props) $$invalidate(36, rowKey = $$props.rowKey);
    		if ('expandSingle' in $$props) $$invalidate(37, expandSingle = $$props.expandSingle);
    		if ('selectSingle' in $$props) $$invalidate(38, selectSingle = $$props.selectSingle);
    		if ('selectOnClick' in $$props) $$invalidate(5, selectOnClick = $$props.selectOnClick);
    		if ('iconAsc' in $$props) $$invalidate(6, iconAsc = $$props.iconAsc);
    		if ('iconDesc' in $$props) $$invalidate(7, iconDesc = $$props.iconDesc);
    		if ('iconSortable' in $$props) $$invalidate(8, iconSortable = $$props.iconSortable);
    		if ('iconExpand' in $$props) $$invalidate(9, iconExpand = $$props.iconExpand);
    		if ('iconExpanded' in $$props) $$invalidate(10, iconExpanded = $$props.iconExpanded);
    		if ('showExpandIcon' in $$props) $$invalidate(11, showExpandIcon = $$props.showExpandIcon);
    		if ('classNameTable' in $$props) $$invalidate(12, classNameTable = $$props.classNameTable);
    		if ('classNameThead' in $$props) $$invalidate(13, classNameThead = $$props.classNameThead);
    		if ('classNameTbody' in $$props) $$invalidate(14, classNameTbody = $$props.classNameTbody);
    		if ('classNameSelect' in $$props) $$invalidate(15, classNameSelect = $$props.classNameSelect);
    		if ('classNameInput' in $$props) $$invalidate(16, classNameInput = $$props.classNameInput);
    		if ('classNameRow' in $$props) $$invalidate(17, classNameRow = $$props.classNameRow);
    		if ('classNameCell' in $$props) $$invalidate(18, classNameCell = $$props.classNameCell);
    		if ('classNameRowSelected' in $$props) $$invalidate(19, classNameRowSelected = $$props.classNameRowSelected);
    		if ('classNameRowExpanded' in $$props) $$invalidate(20, classNameRowExpanded = $$props.classNameRowExpanded);
    		if ('classNameExpandedContent' in $$props) $$invalidate(21, classNameExpandedContent = $$props.classNameExpandedContent);
    		if ('classNameCellExpand' in $$props) $$invalidate(22, classNameCellExpand = $$props.classNameCellExpand);
    		if ('sortFunction' in $$props) $$invalidate(39, sortFunction = $$props.sortFunction);
    		if ('showFilterHeader' in $$props) $$invalidate(25, showFilterHeader = $$props.showFilterHeader);
    		if ('filterValues' in $$props) $$invalidate(23, filterValues = $$props.filterValues);
    		if ('columnByKey' in $$props) $$invalidate(40, columnByKey = $$props.columnByKey);
    		if ('colspan' in $$props) $$invalidate(24, colspan = $$props.colspan);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*columns*/ 16) {
    			{
    				$$invalidate(40, columnByKey = {});

    				columns.forEach(col => {
    					$$invalidate(40, columnByKey[col.key] = col, columnByKey);
    				});
    			}
    		}

    		if ($$self.$$.dirty[0] & /*showExpandIcon, columns*/ 2064) {
    			$$invalidate(24, colspan = (showExpandIcon ? 1 : 0) + columns.length);
    		}

    		if ($$self.$$.dirty[0] & /*sortBy*/ 1 | $$self.$$.dirty[1] & /*columnByKey*/ 512) {
    			{
    				let col = columnByKey[sortBy];

    				if (col !== undefined && col.sortable === true && typeof col.value === "function") {
    					$$invalidate(39, sortFunction = r => col.value(r));
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*filterSelections, sortBy, sortOrder*/ 7 | $$self.$$.dirty[1] & /*rows, columnByKey, sortFunction, rowKey, expanded, selected*/ 807) {
    			$$invalidate(3, c_rows = rows.filter(r => {
    				// get search and filter results/matches
    				return Object.keys(filterSelections).every(f => {
    					// check search (text input) matches
    					let resSearch = filterSelections[f] === "" || columnByKey[f].searchValue && (columnByKey[f].searchValue(r) + "").toLocaleLowerCase().indexOf((filterSelections[f] + "").toLocaleLowerCase()) >= 0;

    					// check filter (dropdown) matches
    					let resFilter = resSearch || filterSelections[f] === undefined || // default to value() if filterValue() not provided in col
    					filterSelections[f] === (typeof columnByKey[f].filterValue === "function"
    					? columnByKey[f].filterValue(r)
    					: columnByKey[f].value(r));

    					return resFilter;
    				});
    			}).map(r => Object.assign({}, r, {
    				// internal row property for sort order
    				$sortOn: sortFunction(r),
    				// internal row property for expanded rows
    				$expanded: rowKey !== null && expanded.indexOf(r[rowKey]) >= 0,
    				$selected: rowKey !== null && selected.indexOf(r[rowKey]) >= 0
    			})).sort((a, b) => {
    				if (!sortBy) return 0; else if (a.$sortOn > b.$sortOn) return sortOrder; else if (a.$sortOn < b.$sortOn) return -sortOrder;
    				return 0;
    			}));
    		}

    		if ($$self.$$.dirty[0] & /*columns*/ 16 | $$self.$$.dirty[1] & /*rows*/ 4) {
    			{
    				// if filters are enabled, watch rows and columns
    				if (showFilterHeader && columns && rows) {
    					calculateFilterValues();
    				}
    			}
    		}
    	};

    	return [
    		sortBy,
    		sortOrder,
    		filterSelections,
    		c_rows,
    		columns,
    		selectOnClick,
    		iconAsc,
    		iconDesc,
    		iconSortable,
    		iconExpand,
    		iconExpanded,
    		showExpandIcon,
    		classNameTable,
    		classNameThead,
    		classNameTbody,
    		classNameSelect,
    		classNameInput,
    		classNameRow,
    		classNameCell,
    		classNameRowSelected,
    		classNameRowExpanded,
    		classNameExpandedContent,
    		classNameCellExpand,
    		filterValues,
    		colspan,
    		showFilterHeader,
    		asStringArray,
    		handleClickCol,
    		handleClickRow,
    		handleClickExpand,
    		handleClickCell,
    		expanded,
    		selected,
    		rows,
    		sortOrders,
    		expandRowKey,
    		rowKey,
    		expandSingle,
    		selectSingle,
    		sortFunction,
    		columnByKey,
    		$$scope,
    		slots,
    		input_input_handler,
    		select_change_handler,
    		click_handler,
    		keypress_handler,
    		click_handler_1,
    		keypress_handler_1,
    		click_handler_2,
    		keypress_handler_2,
    		click_handler_3,
    		keypress_handler_3
    	];
    }

    class SvelteTable extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$1,
    			create_fragment$1,
    			safe_not_equal,
    			{
    				columns: 4,
    				rows: 33,
    				c_rows: 3,
    				sortOrders: 34,
    				sortBy: 0,
    				sortOrder: 1,
    				filterSelections: 2,
    				expanded: 31,
    				selected: 32,
    				expandRowKey: 35,
    				rowKey: 36,
    				expandSingle: 37,
    				selectSingle: 38,
    				selectOnClick: 5,
    				iconAsc: 6,
    				iconDesc: 7,
    				iconSortable: 8,
    				iconExpand: 9,
    				iconExpanded: 10,
    				showExpandIcon: 11,
    				classNameTable: 12,
    				classNameThead: 13,
    				classNameTbody: 14,
    				classNameSelect: 15,
    				classNameInput: 16,
    				classNameRow: 17,
    				classNameCell: 18,
    				classNameRowSelected: 19,
    				classNameRowExpanded: 20,
    				classNameExpandedContent: 21,
    				classNameCellExpand: 22
    			},
    			null,
    			[-1, -1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SvelteTable",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get columns() {
    		throw new Error("<SvelteTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set columns(value) {
    		throw new Error("<SvelteTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rows() {
    		throw new Error("<SvelteTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rows(value) {
    		throw new Error("<SvelteTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get c_rows() {
    		throw new Error("<SvelteTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set c_rows(value) {
    		throw new Error("<SvelteTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sortOrders() {
    		throw new Error("<SvelteTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sortOrders(value) {
    		throw new Error("<SvelteTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sortBy() {
    		throw new Error("<SvelteTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sortBy(value) {
    		throw new Error("<SvelteTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sortOrder() {
    		throw new Error("<SvelteTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sortOrder(value) {
    		throw new Error("<SvelteTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get filterSelections() {
    		throw new Error("<SvelteTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set filterSelections(value) {
    		throw new Error("<SvelteTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get expanded() {
    		throw new Error("<SvelteTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set expanded(value) {
    		throw new Error("<SvelteTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selected() {
    		throw new Error("<SvelteTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<SvelteTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get expandRowKey() {
    		throw new Error("<SvelteTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set expandRowKey(value) {
    		throw new Error("<SvelteTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rowKey() {
    		throw new Error("<SvelteTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rowKey(value) {
    		throw new Error("<SvelteTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get expandSingle() {
    		throw new Error("<SvelteTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set expandSingle(value) {
    		throw new Error("<SvelteTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectSingle() {
    		throw new Error("<SvelteTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectSingle(value) {
    		throw new Error("<SvelteTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectOnClick() {
    		throw new Error("<SvelteTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectOnClick(value) {
    		throw new Error("<SvelteTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconAsc() {
    		throw new Error("<SvelteTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconAsc(value) {
    		throw new Error("<SvelteTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconDesc() {
    		throw new Error("<SvelteTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconDesc(value) {
    		throw new Error("<SvelteTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconSortable() {
    		throw new Error("<SvelteTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconSortable(value) {
    		throw new Error("<SvelteTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconExpand() {
    		throw new Error("<SvelteTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconExpand(value) {
    		throw new Error("<SvelteTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconExpanded() {
    		throw new Error("<SvelteTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconExpanded(value) {
    		throw new Error("<SvelteTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get showExpandIcon() {
    		throw new Error("<SvelteTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showExpandIcon(value) {
    		throw new Error("<SvelteTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classNameTable() {
    		throw new Error("<SvelteTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classNameTable(value) {
    		throw new Error("<SvelteTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classNameThead() {
    		throw new Error("<SvelteTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classNameThead(value) {
    		throw new Error("<SvelteTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classNameTbody() {
    		throw new Error("<SvelteTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classNameTbody(value) {
    		throw new Error("<SvelteTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classNameSelect() {
    		throw new Error("<SvelteTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classNameSelect(value) {
    		throw new Error("<SvelteTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classNameInput() {
    		throw new Error("<SvelteTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classNameInput(value) {
    		throw new Error("<SvelteTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classNameRow() {
    		throw new Error("<SvelteTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classNameRow(value) {
    		throw new Error("<SvelteTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classNameCell() {
    		throw new Error("<SvelteTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classNameCell(value) {
    		throw new Error("<SvelteTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classNameRowSelected() {
    		throw new Error("<SvelteTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classNameRowSelected(value) {
    		throw new Error("<SvelteTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classNameRowExpanded() {
    		throw new Error("<SvelteTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classNameRowExpanded(value) {
    		throw new Error("<SvelteTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classNameExpandedContent() {
    		throw new Error("<SvelteTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classNameExpandedContent(value) {
    		throw new Error("<SvelteTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classNameCellExpand() {
    		throw new Error("<SvelteTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classNameCellExpand(value) {
    		throw new Error("<SvelteTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.53.1 */

    const { console: console_1 } = globals;
    const file = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[20] = list[i];
    	return child_ctx;
    }

    // (140:1) {:else}
    function create_else_block(ctx) {
    	let h20;
    	let t1;
    	let div0;
    	let t2;
    	let div1;
    	let t3;
    	let div2;
    	let t4;
    	let hr0;
    	let t5;
    	let h21;
    	let t7;
    	let current_block_type_index;
    	let if_block3;
    	let t8;
    	let hr1;
    	let t9;
    	let h22;
    	let t10;
    	let t11_value = /*rows*/ ctx[9].length + "";
    	let t11;
    	let t12;
    	let t13;
    	let current_block_type_index_1;
    	let if_block4;
    	let if_block4_anchor;
    	let current;
    	let if_block0 = /*airlines*/ ctx[3].length && create_if_block_5(ctx);
    	let if_block1 = /*departure_airports*/ ctx[5].length && create_if_block_4(ctx);
    	let if_block2 = /*arrival_airports*/ ctx[4].length && create_if_block_3(ctx);
    	const if_block_creators = [create_if_block_2, create_else_block_2];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*_stats_lock*/ ctx[7]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block3 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	const if_block_creators_1 = [create_if_block_1, create_else_block_1];
    	const if_blocks_1 = [];

    	function select_block_type_2(ctx, dirty) {
    		if (/*_data_lock*/ ctx[6]) return 0;
    		return 1;
    	}

    	current_block_type_index_1 = select_block_type_2(ctx);
    	if_block4 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);

    	const block = {
    		c: function create() {
    			h20 = element("h2");
    			h20.textContent = "Flight Data Filters:";
    			t1 = space();
    			div0 = element("div");
    			if (if_block0) if_block0.c();
    			t2 = space();
    			div1 = element("div");
    			if (if_block1) if_block1.c();
    			t3 = space();
    			div2 = element("div");
    			if (if_block2) if_block2.c();
    			t4 = space();
    			hr0 = element("hr");
    			t5 = space();
    			h21 = element("h2");
    			h21.textContent = "Filtered flight data statistics";
    			t7 = space();
    			if_block3.c();
    			t8 = space();
    			hr1 = element("hr");
    			t9 = space();
    			h22 = element("h2");
    			t10 = text("Filtered flights (showing ");
    			t11 = text(t11_value);
    			t12 = text(")");
    			t13 = space();
    			if_block4.c();
    			if_block4_anchor = empty();
    			attr_dev(h20, "class", "svelte-11vmj9j");
    			add_location(h20, file, 140, 2, 3211);
    			set_style(div0, "display", "inline");
    			set_style(div0, "margin", "0 1em");
    			add_location(div0, file, 141, 2, 3243);
    			set_style(div1, "display", "inline");
    			set_style(div1, "margin", "0 1em");
    			add_location(div1, file, 158, 2, 3618);
    			set_style(div2, "display", "inline");
    			set_style(div2, "margin", "0 1em");
    			add_location(div2, file, 175, 2, 4027);
    			set_style(hr0, "border-top", "2px solid #bbb");
    			set_style(hr0, "width", "80%");
    			add_location(hr0, file, 192, 2, 4426);
    			attr_dev(h21, "class", "svelte-11vmj9j");
    			add_location(h21, file, 196, 2, 4541);
    			set_style(hr1, "border-top", "2px solid #bbb");
    			set_style(hr1, "width", "80%");
    			add_location(hr1, file, 206, 2, 4928);
    			attr_dev(h22, "class", "svelte-11vmj9j");
    			add_location(h22, file, 207, 2, 4984);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h20, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div0, anchor);
    			if (if_block0) if_block0.m(div0, null);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);
    			if (if_block1) if_block1.m(div1, null);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div2, anchor);
    			if (if_block2) if_block2.m(div2, null);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, hr0, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, h21, anchor);
    			insert_dev(target, t7, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, hr1, anchor);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, h22, anchor);
    			append_dev(h22, t10);
    			append_dev(h22, t11);
    			append_dev(h22, t12);
    			insert_dev(target, t13, anchor);
    			if_blocks_1[current_block_type_index_1].m(target, anchor);
    			insert_dev(target, if_block4_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*airlines*/ ctx[3].length) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_5(ctx);
    					if_block0.c();
    					if_block0.m(div0, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*departure_airports*/ ctx[5].length) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_4(ctx);
    					if_block1.c();
    					if_block1.m(div1, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*arrival_airports*/ ctx[4].length) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_3(ctx);
    					if_block2.c();
    					if_block2.m(div2, null);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block3 = if_blocks[current_block_type_index];

    				if (!if_block3) {
    					if_block3 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block3.c();
    				} else {
    					if_block3.p(ctx, dirty);
    				}

    				transition_in(if_block3, 1);
    				if_block3.m(t8.parentNode, t8);
    			}

    			if ((!current || dirty & /*rows*/ 512) && t11_value !== (t11_value = /*rows*/ ctx[9].length + "")) set_data_dev(t11, t11_value);
    			let previous_block_index_1 = current_block_type_index_1;
    			current_block_type_index_1 = select_block_type_2(ctx);

    			if (current_block_type_index_1 === previous_block_index_1) {
    				if_blocks_1[current_block_type_index_1].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks_1[previous_block_index_1], 1, 1, () => {
    					if_blocks_1[previous_block_index_1] = null;
    				});

    				check_outros();
    				if_block4 = if_blocks_1[current_block_type_index_1];

    				if (!if_block4) {
    					if_block4 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);
    					if_block4.c();
    				} else {
    					if_block4.p(ctx, dirty);
    				}

    				transition_in(if_block4, 1);
    				if_block4.m(if_block4_anchor.parentNode, if_block4_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block3);
    			transition_in(if_block4);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block3);
    			transition_out(if_block4);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h20);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div0);
    			if (if_block0) if_block0.d();
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div1);
    			if (if_block1) if_block1.d();
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div2);
    			if (if_block2) if_block2.d();
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(hr0);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(h21);
    			if (detaching) detach_dev(t7);
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(hr1);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(h22);
    			if (detaching) detach_dev(t13);
    			if_blocks_1[current_block_type_index_1].d(detaching);
    			if (detaching) detach_dev(if_block4_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(140:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (137:1) {#if airlines.length === 0}
    function create_if_block(ctx) {
    	let spinner;
    	let t0;
    	let h1;
    	let current;
    	spinner = new LoadingSpinner({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(spinner.$$.fragment);
    			t0 = space();
    			h1 = element("h1");
    			h1.textContent = "Loading Flight Data...";
    			attr_dev(h1, "class", "svelte-11vmj9j");
    			add_location(h1, file, 138, 2, 3168);
    		},
    		m: function mount(target, anchor) {
    			mount_component(spinner, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, h1, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(spinner.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(spinner.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(spinner, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(137:1) {#if airlines.length === 0}",
    		ctx
    	});

    	return block;
    }

    // (143:3) {#if airlines.length}
    function create_if_block_5(ctx) {
    	let span;
    	let t1;
    	let select;
    	let mounted;
    	let dispose;
    	let each_value_2 = /*airlines*/ ctx[3];
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Airline:";
    			t1 = space();
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(span, file, 143, 4, 3318);
    			if (/*airline_select*/ ctx[0] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[11].call(select));
    			add_location(select, file, 144, 4, 3344);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, select, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*airline_select*/ ctx[0]);

    			if (!mounted) {
    				dispose = listen_dev(select, "change", /*select_change_handler*/ ctx[11]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*airlines, airline_select*/ 9) {
    				each_value_2 = /*airlines*/ ctx[3];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}

    			if (dirty & /*airline_select, airlines*/ 9) {
    				select_option(select, /*airline_select*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(select);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(143:3) {#if airlines.length}",
    		ctx
    	});

    	return block;
    }

    // (146:5) {#each airlines as airline}
    function create_each_block_2(ctx) {
    	let option;
    	let t0_value = /*airline*/ ctx[20] + "";
    	let t0;
    	let t1;
    	let option_value_value;
    	let option_selected_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t0 = text(t0_value);
    			t1 = space();
    			option.__value = option_value_value = /*airline*/ ctx[20];
    			option.value = option.__value;

    			option.selected = option_selected_value = /*airline_select*/ ctx[0] === /*airline*/ ctx[20]
    			? "selected"
    			: "";

    			add_location(option, file, 146, 6, 3420);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t0);
    			append_dev(option, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*airlines*/ 8 && t0_value !== (t0_value = /*airline*/ ctx[20] + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*airlines*/ 8 && option_value_value !== (option_value_value = /*airline*/ ctx[20])) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}

    			if (dirty & /*airline_select, airlines*/ 9 && option_selected_value !== (option_selected_value = /*airline_select*/ ctx[0] === /*airline*/ ctx[20]
    			? "selected"
    			: "")) {
    				prop_dev(option, "selected", option_selected_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(146:5) {#each airlines as airline}",
    		ctx
    	});

    	return block;
    }

    // (160:3) {#if departure_airports.length}
    function create_if_block_4(ctx) {
    	let span;
    	let t1;
    	let select;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*departure_airports*/ ctx[5];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Departure Airport:";
    			t1 = space();
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(span, file, 160, 4, 3703);
    			if (/*departure_select*/ ctx[2] === void 0) add_render_callback(() => /*select_change_handler_1*/ ctx[12].call(select));
    			add_location(select, file, 161, 4, 3739);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, select, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*departure_select*/ ctx[2]);

    			if (!mounted) {
    				dispose = listen_dev(select, "change", /*select_change_handler_1*/ ctx[12]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*departure_airports, departure_select*/ 36) {
    				each_value_1 = /*departure_airports*/ ctx[5];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			if (dirty & /*departure_select, departure_airports*/ 36) {
    				select_option(select, /*departure_select*/ ctx[2]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(select);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(160:3) {#if departure_airports.length}",
    		ctx
    	});

    	return block;
    }

    // (163:5) {#each departure_airports as airport}
    function create_each_block_1(ctx) {
    	let option;
    	let t0_value = /*airport*/ ctx[15] + "";
    	let t0;
    	let t1;
    	let option_value_value;
    	let option_selected_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t0 = text(t0_value);
    			t1 = space();
    			option.__value = option_value_value = /*airport*/ ctx[15];
    			option.value = option.__value;

    			option.selected = option_selected_value = /*departure_select*/ ctx[2] === /*airport*/ ctx[15]
    			? "selected"
    			: "";

    			add_location(option, file, 163, 6, 3827);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t0);
    			append_dev(option, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*departure_airports*/ 32 && t0_value !== (t0_value = /*airport*/ ctx[15] + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*departure_airports*/ 32 && option_value_value !== (option_value_value = /*airport*/ ctx[15])) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}

    			if (dirty & /*departure_select, departure_airports*/ 36 && option_selected_value !== (option_selected_value = /*departure_select*/ ctx[2] === /*airport*/ ctx[15]
    			? "selected"
    			: "")) {
    				prop_dev(option, "selected", option_selected_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(163:5) {#each departure_airports as airport}",
    		ctx
    	});

    	return block;
    }

    // (177:3) {#if arrival_airports.length}
    function create_if_block_3(ctx) {
    	let span;
    	let t1;
    	let select;
    	let mounted;
    	let dispose;
    	let each_value = /*arrival_airports*/ ctx[4];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Arrival Airport:";
    			t1 = space();
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(span, file, 177, 4, 4110);
    			if (/*arrival_select*/ ctx[1] === void 0) add_render_callback(() => /*select_change_handler_2*/ ctx[13].call(select));
    			add_location(select, file, 178, 4, 4144);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, select, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*arrival_select*/ ctx[1]);

    			if (!mounted) {
    				dispose = listen_dev(select, "change", /*select_change_handler_2*/ ctx[13]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*arrival_airports, arrival_select*/ 18) {
    				each_value = /*arrival_airports*/ ctx[4];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*arrival_select, arrival_airports*/ 18) {
    				select_option(select, /*arrival_select*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(select);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(177:3) {#if arrival_airports.length}",
    		ctx
    	});

    	return block;
    }

    // (180:5) {#each arrival_airports as airport}
    function create_each_block(ctx) {
    	let option;
    	let t0_value = /*airport*/ ctx[15] + "";
    	let t0;
    	let t1;
    	let option_value_value;
    	let option_selected_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t0 = text(t0_value);
    			t1 = space();
    			option.__value = option_value_value = /*airport*/ ctx[15];
    			option.value = option.__value;

    			option.selected = option_selected_value = /*arrival_select*/ ctx[1] === /*airport*/ ctx[15]
    			? "selected"
    			: "";

    			add_location(option, file, 180, 6, 4228);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t0);
    			append_dev(option, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*arrival_airports*/ 16 && t0_value !== (t0_value = /*airport*/ ctx[15] + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*arrival_airports*/ 16 && option_value_value !== (option_value_value = /*airport*/ ctx[15])) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}

    			if (dirty & /*arrival_select, arrival_airports*/ 18 && option_selected_value !== (option_selected_value = /*arrival_select*/ ctx[1] === /*airport*/ ctx[15]
    			? "selected"
    			: "")) {
    				prop_dev(option, "selected", option_selected_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(180:5) {#each arrival_airports as airport}",
    		ctx
    	});

    	return block;
    }

    // (200:2) {:else}
    function create_else_block_2(ctx) {
    	let div0;
    	let t0;
    	let t1_value = /*stats*/ ctx[8].total_count + "";
    	let t1;
    	let t2;
    	let div1;
    	let t3;
    	let t4_value = /*stats*/ ctx[8].filter_count + "";
    	let t4;
    	let t5;
    	let div2;
    	let t6;
    	let t7_value = /*stats*/ ctx[8].average_delay + "";
    	let t7;
    	let t8;
    	let t9;
    	let div3;
    	let t10;
    	let t11_value = /*stats*/ ctx[8].average_ticket + "";
    	let t11;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = text("Total Flights: ");
    			t1 = text(t1_value);
    			t2 = space();
    			div1 = element("div");
    			t3 = text("Filtered Flights: ");
    			t4 = text(t4_value);
    			t5 = space();
    			div2 = element("div");
    			t6 = text("Average Delay: ");
    			t7 = text(t7_value);
    			t8 = text(" minutes");
    			t9 = space();
    			div3 = element("div");
    			t10 = text("Average Ticket Price: $");
    			t11 = text(t11_value);
    			add_location(div0, file, 200, 3, 4638);
    			add_location(div1, file, 201, 3, 4687);
    			add_location(div2, file, 203, 3, 4802);
    			add_location(div3, file, 204, 3, 4861);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, t0);
    			append_dev(div0, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, t3);
    			append_dev(div1, t4);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, t6);
    			append_dev(div2, t7);
    			append_dev(div2, t8);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, t10);
    			append_dev(div3, t11);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*stats*/ 256 && t1_value !== (t1_value = /*stats*/ ctx[8].total_count + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*stats*/ 256 && t4_value !== (t4_value = /*stats*/ ctx[8].filter_count + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*stats*/ 256 && t7_value !== (t7_value = /*stats*/ ctx[8].average_delay + "")) set_data_dev(t7, t7_value);
    			if (dirty & /*stats*/ 256 && t11_value !== (t11_value = /*stats*/ ctx[8].average_ticket + "")) set_data_dev(t11, t11_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(div2);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(div3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(200:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (198:2) {#if _stats_lock}
    function create_if_block_2(ctx) {
    	let spinner;
    	let current;
    	spinner = new LoadingSpinner({ props: { hw: 60 }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(spinner.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(spinner, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(spinner.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(spinner.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(spinner, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(198:2) {#if _stats_lock}",
    		ctx
    	});

    	return block;
    }

    // (211:2) {:else}
    function create_else_block_1(ctx) {
    	let sveltetable;
    	let current;

    	sveltetable = new SvelteTable({
    			props: {
    				columns: /*columns*/ ctx[10],
    				rows: /*rows*/ ctx[9],
    				classNameTable: "table table1",
    				classNameThead: "table-primary"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(sveltetable.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(sveltetable, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const sveltetable_changes = {};
    			if (dirty & /*rows*/ 512) sveltetable_changes.rows = /*rows*/ ctx[9];
    			sveltetable.$set(sveltetable_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sveltetable.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sveltetable.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sveltetable, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(211:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (209:2) {#if _data_lock}
    function create_if_block_1(ctx) {
    	let spinner;
    	let current;
    	spinner = new LoadingSpinner({ props: { hw: 60 }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(spinner.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(spinner, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(spinner.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(spinner.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(spinner, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(209:2) {#if _data_lock}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*airlines*/ ctx[3].length === 0) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			if_block.c();
    			attr_dev(main, "class", "svelte-11vmj9j");
    			add_location(main, file, 135, 0, 3116);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			if_blocks[current_block_type_index].m(main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(main, null);
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
    			if (detaching) detach_dev(main);
    			if_blocks[current_block_type_index].d();
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let airlines = [], arrival_airports = [], departure_airports = [];
    	let airline_select = "None", arrival_select = "None", departure_select = "None";
    	let _data_lock = false, _stats_lock = false;
    	let stats = {};
    	let rows = [];

    	let columns = [
    		{
    			class: "cell",
    			key: "Flight Number",
    			title: "Flight Number",
    			value: v => v["Flight Number"],
    			sortable: true
    		},
    		{
    			key: "Airline",
    			title: "Airline",
    			value: v => v["Airline"],
    			sortable: true
    		},
    		{
    			key: "Departure Airport",
    			title: "Departure Airport",
    			value: v => v["Departure Airport"],
    			sortable: true
    		},
    		{
    			key: "Arrival Airport",
    			title: "Arrival Airport",
    			value: v => v["Arrival Airport"],
    			sortable: true
    		},
    		{
    			key: "Delayed",
    			title: "Delayed",
    			value: v => v["Delayed"],
    			sortable: true
    		},
    		{
    			key: "Delay Time",
    			title: "Delay Time",
    			value: v => v["Delayed"] ? v["Delay Time"] : "N/A",
    			sortable: true
    		},
    		{
    			key: "Distance",
    			title: "Distance (Mi)",
    			value: v => v["Distance"],
    			sortable: true
    		},
    		{
    			key: "ItinFare",
    			title: "Ticket Price ($)",
    			value: v => v["ItinFare"],
    			sortable: true
    		},
    		{
    			key: "Departure Time",
    			title: "Departure Time",
    			value: v => v["Departure Time"],
    			sortable: true
    		},
    		{
    			key: "Scheduled Arrival Time",
    			title: "Scheduled Arrival Time",
    			value: v => v["Scheduled Arrival Time"],
    			sortable: true
    		},
    		{
    			key: "Actual Arrival Time",
    			title: "Actual Arrival Time",
    			value: v => v["Actual Arrival Time"],
    			sortable: true
    		}
    	];

    	fetch("http://localhost:5000/get-filter-values").then(data => data.json()).then(jsonData => {
    		console.log(jsonData);
    		$$invalidate(3, airlines = ["None", ...jsonData["data"]["airlines"]]);
    		$$invalidate(4, arrival_airports = ["None", ...jsonData["data"]["arrival_airports"]]);
    		$$invalidate(5, departure_airports = ["None", ...jsonData["data"]["departure_airports"]]);
    	});

    	function update_rows() {
    		const airline_filter = airline_select === "None" ? "" : airline_select;
    		const arrival_filter = arrival_select === "None" ? "" : arrival_select;
    		const departure_filter = departure_select === "None" ? "" : departure_select;

    		if (!_data_lock) {
    			$$invalidate(6, _data_lock = true);

    			fetch(`http://localhost:5000/get-rows?airline_filter=${airline_filter}&arrival_filter=${arrival_filter}&departure_filter=${departure_filter}`).then(data => data.json()).then(jsonData => {
    				$$invalidate(9, rows = jsonData["data"]);
    				$$invalidate(6, _data_lock = false);
    			});
    		}

    		if (!_stats_lock) {
    			$$invalidate(7, _stats_lock = true);

    			fetch(`http://localhost:5000/get-stats?airline_filter=${airline_filter}&arrival_filter=${arrival_filter}&departure_filter=${departure_filter}`).then(data => data.json()).then(jsonData => {
    				$$invalidate(8, stats = jsonData["data"]);
    				$$invalidate(7, _stats_lock = false);
    			});
    		}
    	}

    	update_rows();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function select_change_handler() {
    		airline_select = select_value(this);
    		$$invalidate(0, airline_select);
    		$$invalidate(3, airlines);
    	}

    	function select_change_handler_1() {
    		departure_select = select_value(this);
    		$$invalidate(2, departure_select);
    		$$invalidate(5, departure_airports);
    	}

    	function select_change_handler_2() {
    		arrival_select = select_value(this);
    		$$invalidate(1, arrival_select);
    		$$invalidate(4, arrival_airports);
    	}

    	$$self.$capture_state = () => ({
    		Spinner: LoadingSpinner,
    		SvelteTable,
    		airlines,
    		arrival_airports,
    		departure_airports,
    		airline_select,
    		arrival_select,
    		departure_select,
    		_data_lock,
    		_stats_lock,
    		stats,
    		rows,
    		columns,
    		update_rows
    	});

    	$$self.$inject_state = $$props => {
    		if ('airlines' in $$props) $$invalidate(3, airlines = $$props.airlines);
    		if ('arrival_airports' in $$props) $$invalidate(4, arrival_airports = $$props.arrival_airports);
    		if ('departure_airports' in $$props) $$invalidate(5, departure_airports = $$props.departure_airports);
    		if ('airline_select' in $$props) $$invalidate(0, airline_select = $$props.airline_select);
    		if ('arrival_select' in $$props) $$invalidate(1, arrival_select = $$props.arrival_select);
    		if ('departure_select' in $$props) $$invalidate(2, departure_select = $$props.departure_select);
    		if ('_data_lock' in $$props) $$invalidate(6, _data_lock = $$props._data_lock);
    		if ('_stats_lock' in $$props) $$invalidate(7, _stats_lock = $$props._stats_lock);
    		if ('stats' in $$props) $$invalidate(8, stats = $$props.stats);
    		if ('rows' in $$props) $$invalidate(9, rows = $$props.rows);
    		if ('columns' in $$props) $$invalidate(10, columns = $$props.columns);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*airline_select*/ 1) {
    			(update_rows());
    		}

    		if ($$self.$$.dirty & /*arrival_select*/ 2) {
    			(update_rows());
    		}

    		if ($$self.$$.dirty & /*departure_select*/ 4) {
    			(update_rows());
    		}
    	};

    	return [
    		airline_select,
    		arrival_select,
    		departure_select,
    		airlines,
    		arrival_airports,
    		departure_airports,
    		_data_lock,
    		_stats_lock,
    		stats,
    		rows,
    		columns,
    		select_change_handler,
    		select_change_handler_1,
    		select_change_handler_2
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
