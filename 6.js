// CPCS 324 Algorithms & Data Structures 2
// Graph data structure starter - First Edge Object
// 2019, Dr. Muhammad Al-Hashimi

// -----------------------------------------------------------------------
// simple graph object with linked-list edge implementation and minimal fields
// extra vertex and edge member fields and methods to be added later as needed
//

var _v = [], _e = [];   // globals used by standard graph reader method


// -----------------------------------------------------------------------
// global caller function, a main() for the caller page
// only function allowed to access global vars

function _main() {
   // create a graph (default undirected)
   var g = new Graph();

   // set input graph properties (label, directed etc.)
   g.label = "Figure 3.10 (Levitin, 3rd edition)}";

   // use global input arrays _v and _e to initialize its internal data structures
   g.read_graph(_v, _e);//set graph

   // use print_graph() method to check graph
   g.print_graph();

   // report connectivity status if available
   var c = g.componentInfo();
	document.write("<p>", c, "</p>");



   // perform depth-first search and output stored result
   g.topoSearch('d');
   document.write("<p>dfs_push: ", g.dfs_push, "</p>");

   // report connectivity status if available
   var c = g.componentInfo();
	document.write("<p>", c, "</p>");


   // perform breadth-first search and output stored result
   g.topoSearch('b');
   document.write("<p>bfs_out: ", g.bfs_out, "</p>");

   // output the graph adjacency matrix
   g.makeAdjMatrix();

   document.write("<p>first row matrix: ", g.matrix[0], "</p>");


   document.write("<p>last row matrix: ", g.matrix[g.nv - 1], "</p>");


}


// -----------------------------------------------------------------------
// Vertex object constructor

function Vertex(v) {
   // user input fields

   this.label = v.label;          // vertex can be labelled

   // more fields to initialize internally

   this.visit = false;            // vertex can be marked visited or "seen"
   this.adjacent = new List();    // init an adjacency list

   // --------------------
   // member methods use functions defined below

   this.adjacentById = adjacentById;   // return target id of incident edges in array

}

// -----------------------------------------------------------------------
// Edge object constructor
function Edge() {
   this.target_v;
   this.weight;

}


// -----------------------------------------------------------------------
// Graph object constructor

function Graph() {
   this.vert = [];                // vertex list (an array of Vertex objects)
   this.nv;                       // number of vertices
   this.ne;                       // number of edges
   this.digraph = false;          // true if digraph, false otherwise (default undirected)
   this.dfs_push = [];            // DFS order output
   this.bfs_out = [];             // BFS order output
   this.label = "";               // identification string to label graph

   // --------------------
   // student property fields next
   this.q = new Queue();
   this.connectedComp = 0;   // number of connected comps set by DFS; 0 (default) for no info
   this.matrix = [];          // graph adjacency matrix to be created on demand


   // --------------------
   // member methods use functions defined below

   this.read_graph = better_input;   // default input reader method
   this.print_graph = better_output; // better printer function
   this.list_vert = list_vert;

   this.add_edge = add_edge;        // replace (don't change old .add_edge)
   this.dfs = dfs;                  // DFS a connected component
   this.bfs = bfs;                  // BFS a connected component


   // --------------------
   // student methods next; implementing functions in student code section at end

   this.topoSearch = topoSearch// perform a topological search
   this.makeAdjMatrix = makeAdjMatrix;
   this.add_edge2 = add_edge2;
   this.weighted = false;
   this.componentInfo=componentInfo;

}




// -------------------------------------------------------
// Functions used by methods of Graph object. Similar to
// normal functions but use object member fields and
// methods, depending on which object is passed by the
// method call through the self variable: this.
//

// --------------------
function list_vert() {
   var i, v;  // local vars
   for (i = 0; i < this.nv; i++) {
      v = this.vert[i];
      document.write("VERTEX: ", i, " {", v.label, "} - VISIT: ", v.visit,
         " - ADJACENCY: ", v.adjacentById(), "<br>");
   }
}

// --------------------
function better_input(v, e) {
   this.nv = v.length;
   this.ne = e.length;

   // input vertices into internal vertex array
   for (var i = 0; i < this.nv; i++) {
      this.vert[i] = new Vertex(v[i])
   };


   // input vertex pairs from edge list input array
   // remember to pass vertex ids to add_edge()
   if ((typeof e[0].w == 'undefined') == false) { this.weighted = true; }
   for (var i = 0; i < this.ne; i++) {
      this.add_edge2(e[i].u, e[i].v, e[i].w);
   }


   // double edge count if graph undirected
   if (!this.digraph) { this.ne = this.ne * 2; }
}

// --------------------
function better_output() {
	document.write("<p>GRAPH {", this.label, "} ", this.weighted ? "WEIGHTED, " : "", this.digraph ? "" : "UN", "DIRECTED - ", this.nv,
		" VERTICES, ", this.ne, " EDGES:", "</p>");
   // list vertices
   this.list_vert();
}

// --------------------
function add_edge(u_i, v_i)   //  g.read_graph(_v, _e);//set graph, replaced by add_edge2() below
{

}

// --------------------
function dfs(v_i) {
   //get landing vert by id then process
   var v = this.vert[v_i];
   v.visit = true;//mark as visited
   this.dfs_push.push(v_i);//push into the stack
   // recursively traverse unvisited adjacent vertices
   var w = this.vert[v_i].adjacentById()  // list of the adjecent vertices 
   for (var i = 0; i < w.length; i++) {
      if (this.vert[w[i]].visit == false) {
         this.dfs(w[i]);
      }
   }
   //dead end 
   // start popping
   //this.dfs_pop.push(v_i); 
}

// --------------------
function bfs(v_i) {
   // get vertex v by its id
   var v = this.vert[v_i];

   // process v 
   v.visit = true;

   // initialize queue with v
   this.q.enqueue(v_i);

   // while queue not empty
   while (this.q.isEmpty() == false) {

      // dequeue and process a vertex, u
      var u = this.q.dequeue();
      this.bfs_out.push(u);

      // queue all unvisited vertices adjacent to u
      //var uv=this.vert[u].adjacent.traverse();
      var w = this.vert[u].adjacentById();// list of the adjecent vertices 
      for (var i = 0; i < w.length; i++) {
         if (this.vert[w[i]].visit == false) {
            this.vert[w[i]].visit = true;//mark as visited 
            this.q.enqueue(w[i]);
         }
      }
   }
}


// -----------------------------------------------------------------------
// -----------------------------------------------------------------------
// --- begin student code section ----------------------------------------

function adjacentById() {
   var adjacents = this.adjacent.traverse();
   var tra_Adj = [];
   for (i = 0; i < adjacents.length; i++) {
      tra_Adj[i] = adjacents[i].target_v;



   }
   return tra_Adj;
}

// --------------------
function add_edge2(u_i, v_i, w_i) {
   // fetch vertices using their id, where u: edge source vertex, v: target vertex
   vert_u = this.vert[u_i];
   vert_v = this.vert[v_i];



   // insert (u,v), i.e., insert v in adjacency list of u
   // (first create edge object using v_i as target, then pass object)
   var e1 = new Edge();
   e1.target_v = v_i;
   if (this.weighted) {
      e1.weight = w_i;
   }
   vert_u.adjacent.insert(e1);


   // insert (v,u) if undirected graph (repeat above but reverse vertex order)
   if (!this.digraph) {

      var e2 = new Edge();
      e2.target_v = u_i;
      if (this.weighted) {
         e2.weight = w_i;
      }
      vert_v.adjacent.insert(e2);

   }


}

// --------------------
function topoSearch(t) {
   // mark all vertices unvisited
   for (var i = 0; i < this.nv; i++) {
      this.vert[i].visit = false;
   };
   // traverse unvisited connected components
   for (var i = 0; i < this.nv; i++) {
      if (this.vert[i].visit == false) {
         if (t == 'd') {
            this.dfs(i);
         }
         if (t == 'b') {
            this.bfs(i);
         }
         this.connectedComp++;
      }
   }

}

// --------------------
function makeAdjMatrix() {
   // initially create row elements and zero the adjacency matrix
   for (var i = 0; i < this.nv; i++) {
      this.matrix[i] = [];
      for (var j = 0; j < this.nv; j++) {
         this.matrix[i][j] = 0;
      }
   }

   // for each vertex, set 1 for each adjacency
   for (var i = 0; i < this.nv; i++) {
      var adj = this.vert[i].adjacentById();
      for (var j = 0; j < adj.length; j++) {
         if (this.weighted) {
            var w = this.vert[i].adjacent.traverse();
            this.matrix[i][adj[j]] = w[j].weight;

         } else {
            this.matrix[i][adj[j]] = 1;
         }
      }
   }


}
//-----------------------------------------------------------------------
function componentInfo() {
	var info;
	var cc = this.connectedComp;
	if (cc == 0)
		info = "no connectivity info";
	else if (cc == 1)
		info = "CONNECTED";
	else
		info = "DISCONNECTED " + this.connectedComp;

	return info;

}