package main

import (
// 	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
// 	"time"

	"github.com/gorilla/mux"
// 	"go.mongodb.org/mongo-driver/mongo/options"
// 	"go.mongodb.org/mongo-driver/mongo/readpref"
)

type Author struct {
	Firstname string `json:"firstname"`
	Lastname  string `json:"lastname"`
}

type Book struct {
	ID     string  `json:"id"`
	Isbn   string  `json:"isbn"`
	Title  string  `json:"title"`
	Author *Author `json:"author"`
}

type Books []Book

func getBooks(w http.ResponseWriter, r *http.Request) {
	// w.Header().Set("Content-type", "application/json")
	books := Books{
		Book{ID: "123", Isbn: "ai", Title: "title jere", Author: &Author{Firstname: "yuri", Lastname: "krup"}},
	}
	fmt.Println("Endpoint hit: All Articles Endpoont")
	json.NewEncoder(w).Encode(books)
}

func getBook(w http.ResponseWriter, r *http.Request) {

}

func creteBook(w http.ResponseWriter, r *http.Request) {

}

func deleteBook(w http.ResponseWriter, r *http.Request) {

}
func updateBook(w http.ResponseWriter, r *http.Request) {

}

func homePage(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Welcome to the HomePage!")
	fmt.Println("Endpoint Hit: homePage")
}

func handleRequests() {
	myRouter := mux.NewRouter().StrictSlash(true)
	myRouter.HandleFunc("/", homePage)
	myRouter.HandleFunc("/books", getBooks).Methods("GET")
	log.Fatal(http.ListenAndServe(":3000", myRouter))
}

func main() {
// 	client, err := mongo.newClient(options.Client().ApplyURI("mongodb+srv://yurikrupnik:T4eXKj1RBI4VnszC@cluster0.rdmew.mongodb.net/"))
// 	if err != nil {
// 		log.Fatal(err)
// 	}
// 	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
// 	err = client.Connect(ctx)
// 	if err != nil {
// 		log.Fatal(err)
// 	}
// 	defer client.Disconnect(ctx)
// 	err = client.Ping(ctx, readpref.Primary())
// 	if err != nil {
// 		log.Fatal(err)
// 	}
	handleRequests()
}
